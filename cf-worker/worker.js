export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
      const body = await request.json();
      const email = body.email;
      const code = body.code;
      const url = new URL(request.url);

      // 1. 发信接口
      if (url.pathname === '/' && code) {
        const RESEND_API_KEY = "re_UwipgL4a_NSHWTWuHA2cdQYk6ZnwAFgyg";
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "SOCKS5 <noreply@lynli.me>",
            to: [email],
            subject: "SOCKS5 邮箱验证码",
            html: `<div style="padding:20px;font-family:sans-serif;"><h2>您的验证码是：${code}</h2></div>`
          })
        });
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
      }

      // 2. 注册/获取用户信息接口
      if (url.pathname === '/register') {
        let user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        
        if (!user) {
          const nickname = email.split('@')[0];
          const avatar = "https://web.lynli.me/logo.jpg";
          
          // 查找当前最大的 user_id
          const maxRow = await env.DB.prepare("SELECT MAX(user_id) as max_id FROM users").first();
          let nextUid = 10000; // 默认从 10000 开始
          
          if (maxRow && maxRow.max_id) {
             nextUid = maxRow.max_id + 1;
          }
          
          // 生成 32 位随机字符串
          const randStr = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
          const appSecret = 'sec_' + randStr;
          
          await env.DB.prepare("INSERT INTO users (email, nickname, avatar, user_id, app_secret) VALUES (?, ?, ?, ?, ?)")
            .bind(email, nickname, avatar, nextUid, appSecret).run();
            
          user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        } else if (!user.user_id) {
          // 补发逻辑
          const maxRow = await env.DB.prepare("SELECT MAX(user_id) as max_id FROM users").first();
          let nextUid = (maxRow && maxRow.max_id) ? maxRow.max_id + 1 : 10000;
          const randStr = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
          const appSecret = 'sec_' + randStr;
          
          await env.DB.prepare("UPDATE users SET user_id = ?, app_secret = ? WHERE email = ?").bind(nextUid, appSecret, email).run();
          user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        }
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: { 
            email: user.email, nickname: user.nickname, avatar: user.avatar, 
            user_id: user.user_id, app_secret: user.app_secret, token: 'd1_' + Date.now() 
          } 
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // 3. 修改资料接口
      if (url.pathname === '/update-profile') {
        const newNickname = body.nickname;
        const newAvatar = body.avatar;
        await env.DB.prepare("UPDATE users SET nickname = ?, avatar = ? WHERE email = ?")
          .bind(newNickname, newAvatar, email).run();
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      
      // ========== 卡密库存 API ==========
      if (url.pathname === '/api/add_stock' && request.method === 'POST') {
        if (request.headers.get('X-Admin-Key') !== env.ADMIN_KEY)
          return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const cards = body.cards || [];
        const pid = body.product_id || 1;
        const now = Math.floor(Date.now() / 1000);
        const stmt = env.DB.prepare("INSERT OR IGNORE INTO static_inventory (product_id,card_info,account,password,is_sold,created_at) VALUES (?,?,?,?,0,?)");
        const batch = cards.map(c => { const p = c.split('----'); return stmt.bind(pid, c, p[0]||c, p[1]||'', now); });
        const r = await env.DB.batch(batch);
        return new Response(JSON.stringify({ success: true, submitted: cards.length, inserted: r.filter(x => x.meta.changes > 0).length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (url.pathname === '/api/stats' && request.method === 'GET') {
        if (request.headers.get('X-Admin-Key') !== env.ADMIN_KEY)
          return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const r = await env.DB.prepare("SELECT product_id, COUNT(*) total, SUM(CASE WHEN is_sold=0 THEN 1 ELSE 0 END) avail FROM static_inventory GROUP BY product_id").all();
        return new Response(JSON.stringify({ code: 200, data: r.results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (url.pathname === '/api/deliver' && request.method === 'POST') {
        const tk = (request.headers.get('Authorization') || '').replace('Bearer ', '');
        if (tk !== env.BUYER_KEY)
          return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const pid = body.product_id || 1;
        const order = body.order_no || '';
        const row = await env.DB.prepare("SELECT id,card_info FROM static_inventory WHERE product_id=? AND is_sold=0 ORDER BY id LIMIT 1").bind(pid).first();
        if (!row) return new Response(JSON.stringify({ code: 404, msg: 'no stock' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        await env.DB.prepare("UPDATE static_inventory SET is_sold=1,sold_to=?,sold_at=? WHERE id=? AND is_sold=0").bind(order, Math.floor(Date.now() / 1000), row.id).run();
        return new Response(JSON.stringify({ code: 200, data: row.card_info }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      if (url.pathname === '/api/extract' && request.method === 'GET') {
        const key = url.searchParams.get('key') || '';
        if (key !== env.BUYER_KEY)
          return new Response(JSON.stringify({ error: 'invalid key' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const cnt = Math.min(parseInt(url.searchParams.get('count') || '1'), 100);
        const pid = parseInt(url.searchParams.get('product_id') || '1');
        const res = await env.DB.prepare("SELECT id,card_info FROM static_inventory WHERE product_id=? AND is_sold=0 ORDER BY id LIMIT ?").bind(pid, cnt).all();
        const items = res.results || [];
        if (!items.length) return new Response(JSON.stringify({ code: 404, data: [] }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        const nowTs = Math.floor(Date.now() / 1000);
        await env.DB.batch(items.map(x => env.DB.prepare("UPDATE static_inventory SET is_sold=1,sold_to=?,sold_at=? WHERE id=?").bind('card:' + key, nowTs, x.id)));
        return new Response(JSON.stringify({ code: 200, data: items.map(x => x.card_info) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      // ========== /卡密库存 API ==========
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }
}
