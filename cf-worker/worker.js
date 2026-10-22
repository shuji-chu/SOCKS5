export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Type": "application/json"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    try {
      let body = {};
      if (request.method === "POST") {
        const txt = await request.text();
        if (txt) body = JSON.parse(txt);
      }

      if (p === "/api/add_stock" && request.method === "POST") {
        if (request.headers.get("X-Admin-Key") !== env.ADMIN_KEY) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: cors });
        const cards = body.cards || [];
        const pid = body.product_id || 1;
        const now = Math.floor(Date.now() / 1000);
        const stmt = env.DB.prepare("INSERT OR IGNORE INTO static_inventory (product_id,card_info,account,password,is_sold,created_at) VALUES (?,?,?,?,0,?)");
        const batch = cards.map(c => { const sp = c.split('----'); return stmt.bind(pid, c, sp[0]||c, sp[1]||'', now); });
        const r = await env.DB.batch(batch);
        return new Response(JSON.stringify({ success: true, submitted: cards.length, inserted: r.filter(x => x.meta.changes > 0).length }), { headers: cors });
      }

      if (p === "/api/stats" && request.method === "GET") {
        if (request.headers.get("X-Admin-Key") !== env.ADMIN_KEY) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: cors });
        const r = await env.DB.prepare("SELECT product_id, COUNT(*) total, SUM(CASE WHEN is_sold=0 THEN 1 ELSE 0 END) avail FROM static_inventory GROUP BY product_id").all();
        return new Response(JSON.stringify({ code: 200, data: r.results }), { headers: cors });
      }

      if (p === "/api/deliver" && request.method === "POST") {
        const tk = (request.headers.get("Authorization") || "").replace("Bearer ", "");
        if (tk !== env.BUYER_KEY) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: cors });
        const pid = body.product_id || 1;
        const order = body.order_no || "";
        const row = await env.DB.prepare("SELECT id,card_info FROM static_inventory WHERE product_id=? AND is_sold=0 ORDER BY id LIMIT 1").bind(pid).first();
        if (!row) return new Response(JSON.stringify({ code: 404, msg: "no stock" }), { status: 404, headers: cors });
        await env.DB.prepare("UPDATE static_inventory SET is_sold=1,sold_to=?,sold_at=? WHERE id=? AND is_sold=0").bind(order, Math.floor(Date.now() / 1000), row.id).run();
        return new Response(JSON.stringify({ code: 200, data: row.card_info }), { headers: cors });
      }

      if (p === "/api/extract" && request.method === "GET") {
        const key = url.searchParams.get("key") || "";
        if (key !== env.BUYER_KEY) return new Response(JSON.stringify({ error: "invalid key" }), { status: 401, headers: cors });
        const cnt = Math.min(parseInt(url.searchParams.get("count") || "1"), 100);
        const pid = parseInt(url.searchParams.get("product_id") || "1");
        const res = await env.DB.prepare("SELECT id,card_info FROM static_inventory WHERE product_id=? AND is_sold=0 ORDER BY id LIMIT ?").bind(pid, cnt).all();
        const items = res.results || [];
        if (!items.length) return new Response(JSON.stringify({ code: 404, data: [] }), { status: 404, headers: cors });
        const nowTs = Math.floor(Date.now() / 1000);
        await env.DB.batch(items.map(x => env.DB.prepare("UPDATE static_inventory SET is_sold=1,sold_to=?,sold_at=? WHERE id=?").bind('card:' + key, nowTs, x.id)));
        return new Response(JSON.stringify({ code: 200, data: items.map(x => x.card_info) }), { headers: cors });
      }

      if (p === "/" && request.method === "POST") {
        return new Response(JSON.stringify({ success: true, msg: "worker running" }), { headers: cors });
      }

      
      if (p === "/api/init" && request.method === "GET") {
        try {
          await env.DB.prepare("CREATE TABLE IF NOT EXISTS static_inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL DEFAULT 1, card_info TEXT NOT NULL, account TEXT, password TEXT, is_sold INTEGER NOT NULL DEFAULT 0, sold_to TEXT, sold_at INTEGER, created_at INTEGER)").run();
          await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_card ON static_inventory(card_info)").run();
          return new Response("OK: table created", { headers: cors });
        } catch (e) {
          return new Response("ERROR: " + e.message, { status: 500, headers: cors });
        }
      }

      
      // ===== 标准发卡网通用接口 =====
      if ((p === "/api/faka" || p === "/api/faka/") && (request.method === "GET" || request.method === "POST")) {
        let key = "", pid = 1, count = 1;
        if (request.method === "GET") {
          key = url.searchParams.get("key") || "";
          pid = parseInt(url.searchParams.get("product_id") || "1");
          count = parseInt(url.searchParams.get("count") || "1");
        } else {
          key = body.key || "";
          pid = body.product_id || 1;
          count = body.count || 1;
        }
        
        if (key !== env.BUYER_KEY) {
          return new Response(JSON.stringify({ code: 401, msg: "key错误" }), { headers: cors });
        }
        
        // 获取未售出的卡密
        const res = await env.DB.prepare("SELECT id, card_info FROM static_inventory WHERE product_id=? AND is_sold=0 ORDER BY id LIMIT ?").bind(pid, count).all();
        const items = res.results || [];
        
        if (items.length === 0) {
          return new Response(JSON.stringify({ code: 404, msg: "库存不足" }), { headers: cors });
        }
        
        // 标记为已售
        const now = Math.floor(Date.now() / 1000);
        await env.DB.batch(items.map(x => env.DB.prepare("UPDATE static_inventory SET is_sold=1, sold_to=?, sold_at=? WHERE id=?").bind("faka", now, x.id)));
        
        // 拼接为规范格式（多行用 \n 拼接）
        const resultText = items.map(x => x.card_info).join("\n");
        
        // 标准发卡网返回结构
        return new Response(JSON.stringify({ 
          code: 200, 
          msg: "获取成功", 
          data: resultText 
        }), { headers: cors });
      }

      
      if (p === "/api/reset" && request.method === "GET") {
        if (url.searchParams.get("key") !== env.ADMIN_KEY) return new Response("auth error", { status: 401, headers: cors });
        await env.DB.prepare("UPDATE static_inventory SET is_sold=0, sold_to=NULL, sold_at=NULL").run();
        return new Response("Reset OK", { headers: cors });
      }

      return new Response("Not Found", { status: 404, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
    }
  }
};
