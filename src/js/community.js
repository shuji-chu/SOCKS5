/* S5 community + profile front-end. API contracts are documented in /src/docs/. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .s5-shell{color:#dcecff;background:radial-gradient(ellipse at 80% 0,#163a62 0,transparent 42%),linear-gradient(145deg,#06111f,#0b1c30 55%,#081323);border:1px solid #234566;border-radius:24px;padding:clamp(18px,4vw,36px);min-height:62vh}
    .s5-muted{color:#91aac4}.s5-chip{border:1px solid #294e70;background:#102944;color:#c8e6ff;border-radius:999px;padding:8px 13px;font-size:12px}
    .s5-card{border:1px solid #244664;background:linear-gradient(145deg,#102944,#0b1d31);border-radius:16px;padding:18px}
    .s5-field{width:100%;border:1px solid #294e70;background:#071727;color:#e5f3ff;border-radius:10px;padding:12px;outline:none}
    .s5-btn{display:inline-flex;align-items:center;justify-content:center;background:#2f8cff;color:#fff;font-weight:700;border-radius:10px;padding:11px 16px;cursor:pointer}
    .s5-btn:disabled{opacity:.5;cursor:not-allowed}.s5-link{color:#70b9ff}.s5-avatar{width:68px;height:68px;object-fit:cover;border-radius:50%;border:2px solid #60b7ff;background:#102944}
    @media(max-width:640px){.s5-shell{border-radius:16px;padding:16px}.s5-grid{grid-template-columns:1fr!important}}
  `;
  document.head.appendChild(style);

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUiMessage = (v) => String(v ?? '操作未完成').replace(/Bearer\s+\S+/gi,'[凭据已隐藏]').replace(/\b(access[_-]?token|refresh[_-]?token|api[_-]?key|secret|password|authorization)\s*[:=]\s*["']?[^,\s"';&]+/gi,'$1=[凭据已隐藏]').replace(/(?:\b[0-9a-f]{1,4}:){2,}[0-9a-f:.]{1,}/gi,'[IP地址已隐藏]').replace(/https?:\/\/[^\s"'<>]+/gi,'[链接已隐藏]').replace(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d+)?\b/gi,'[地址已隐藏]').replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g,'[地址已隐藏]').replace(/(?:^|\n)\s*at\s+[^\n]+/g,'').slice(0,240) || '操作未完成，请稍后重试。';
  const token = () => localStorage.getItem('sosks5_token') || '';
  const api = async (path, opts = {}) => {
    const headers = { ...(opts.headers || {}) };
    if (token()) headers.Authorization = 'Bearer ' + token();
    if (opts.body && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const r = await fetch('/api' + path, {...opts, headers});
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(safeUiMessage(data.message || ('请求未成功（HTTP ' + r.status + '）')));
    return data;
  };
  const shell = (inner) => '<section class="s5-shell">' + inner + '</section>';
  const communityHome = () => shell(`
    <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
      <div><div class="text-xs tracking-[.25em] text-sky-300 font-bold mb-3">S5 · 晴天社区</div>
      <h1 class="text-3xl md:text-5xl font-black text-white mb-3">让好内容被发现</h1>
      <p class="s5-muted max-w-2xl leading-7">发现工具、教程、资源与服务；分享真实有用的链接，让需要的人找到它。</p></div>
      <a class="s5-btn shrink-0" href="#/traffic/new">＋ 发布分享</a>
    </div>
    <div class="flex flex-wrap gap-2 mb-5">
      <button class="s5-chip" data-s5-cat="">全部</button><button class="s5-chip" data-s5-cat="工具">工具</button><button class="s5-chip" data-s5-cat="教程">教程</button><button class="s5-chip" data-s5-cat="资源">资源</button><button class="s5-chip" data-s5-cat="服务">服务</button><button class="s5-chip" data-s5-cat="作品">作品</button>
    </div>
    <div class="flex flex-col sm:flex-row gap-3 mb-7"><input id="s5-search" class="s5-field" placeholder="搜索标题、简介或标签…"><button id="s5-search-btn" class="s5-btn">搜索</button></div>
    <div id="s5-posts" class="grid s5-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><div class="s5-card s5-muted">正在加载内容…</div></div>
    <p class="s5-muted text-xs mt-6">请分享合法、真实且拥有发布权的内容；商业推广请明确标注。</p>
  `);
  const profileView = () => {
    const u = App.state.user || {};
    const nickname = u.nickname || u.username || (u.email ? u.email.split('@')[0] : '');
    const avatar = u.avatar_url || u.avatar || '';
    return shell(`
      <div class="max-w-2xl mx-auto"><a href="#/dashboard" class="s5-link text-sm">← 返回用户中心</a>
      <h1 class="text-3xl font-black text-white mt-4 mb-2">个人资料</h1><p class="s5-muted mb-7">设置昵称和头像，资料会显示在你的内容与个人主页中。</p>
      <div class="s5-card">
        <div class="flex items-center gap-4 mb-6"><img id="s5-avatar-preview" class="s5-avatar" src="${esc(avatar || './assets/sok.png')}" alt="头像"><div><div class="font-bold text-white">个人头像</div><p class="s5-muted text-xs mt-1">支持手机相册选择图片，建议不超过 2 MB。</p><label class="s5-btn mt-3">选择照片<input id="s5-avatar-file" type="file" accept="image/*" class="hidden"></label></div></div>
        <label class="block text-sm font-semibold mb-2">昵称</label><input id="s5-nickname" class="s5-field mb-5" maxlength="32" value="${esc(nickname)}" placeholder="输入你想展示的昵称">
        <label class="block text-sm font-semibold mb-2">个人简介</label><textarea id="s5-bio" class="s5-field mb-5" maxlength="240" rows="3" placeholder="简单介绍一下自己…">${esc(u.bio || '')}</textarea>
        <div class="rounded-xl border border-sky-900 bg-sky-950/40 p-4 mb-5"><div class="text-xs s5-muted mb-1">用户 ID</div><div class="text-2xl text-white font-black tracking-widest">${esc(u.public_id || u.user_id || '由服务器分配')}</div><p class="s5-muted text-xs mt-2">ID 由服务端唯一分配，不能只在手机本地生成，否则不同用户可能重复。</p></div>
        <button id="s5-profile-save" class="s5-btn w-full">保存资料</button><p id="s5-profile-status" class="s5-muted text-sm mt-3" role="status"></p>
      </div></div>
    `);
  };
  const newPostView = () => shell(`
    <div class="max-w-2xl mx-auto"><a href="#/traffic" class="s5-link text-sm">← 返回引流广场</a><h1 class="text-3xl font-black text-white mt-4 mb-2">发布分享</h1><p class="s5-muted mb-6">提交链接和原创介绍。后端接入后会保存并展示给其他用户。</p>
    <form id="s5-post-form" class="s5-card space-y-4">
      <div><label class="block text-sm mb-2">标题</label><input class="s5-field" name="title" maxlength="100" required placeholder="用一句话说明分享内容"></div>
      <div><label class="block text-sm mb-2">外部链接</label><input class="s5-field" name="url" type="url" maxlength="2048" required placeholder="https://…"></div>
      <div><label class="block text-sm mb-2">分类</label><select class="s5-field" name="category"><option>工具</option><option>教程</option><option>资源</option><option>服务</option><option>作品</option><option>其他</option></select></div>
      <div><label class="block text-sm mb-2">简介</label><textarea class="s5-field" name="description" maxlength="1200" rows="5" required placeholder="介绍它的用途、特点和适合谁使用"></textarea></div>
      <div><label class="block text-sm mb-2">标签（用逗号分隔）</label><input class="s5-field" name="tags" maxlength="200" placeholder="设计,效率,开发"></div>
      <button class="s5-btn w-full" type="submit">提交分享</button><p id="s5-post-status" class="s5-muted text-sm" role="status"></p>
    </form></div>
  `);

  async function loadPosts(category = '', keyword = '') {
    const box = document.getElementById('s5-posts');
    if (!box) return;
    box.innerHTML = '<div class="s5-card s5-muted">正在加载…</div>';
    try {
      const q = new URLSearchParams();
      if (category) q.set('category', category);
      if (keyword) q.set('q', keyword);
      const r = await api('/traffic/posts' + (q.toString() ? '?' + q : ''));
      const rows = r.data || [];
      box.innerHTML = rows.length ? rows.map(p => `
        <article class="s5-card"><div class="text-xs text-sky-300 mb-3">${esc(p.category || '分享')} · ${esc(p.created_at || '')}</div>
        <h2 class="text-lg font-bold text-white mb-2">${esc(p.title)}</h2><p class="s5-muted text-sm leading-6 mb-4">${esc(p.description || '')}</p>
        <div class="flex flex-wrap gap-2 mb-4">${(p.tags || []).map(t => '<span class="s5-chip">'+esc(t)+'</span>').join('')}</div>
        <div class="flex items-center justify-between gap-3 text-xs s5-muted"><span>${esc(p.author?.nickname || 'SOSKS5 用户')} · ID ${esc(p.author?.public_id || '—')}</span><a class="s5-link font-bold" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">查看来源 ↗</a></div></article>
      `).join('') : '<div class="s5-card s5-muted">暂无内容。你可以成为第一个分享的人。</div>';
    } catch (e) {
      box.innerHTML = '<div class="s5-card"><div class="text-white font-bold mb-2">引流内容 API 尚未接通</div><p class="s5-muted text-sm">前端页面已准备好；接入后端并实现 GET /api/traffic/posts 后，这里会自动显示内容。</p></div>';
    }
  }

  function route() {
    const hash = location.hash || '#/';
    const view = document.getElementById('app-view');
    if (!view) return;
    if (hash === '#/traffic') {
      view.innerHTML = communityHome();
      loadPosts();
      view.querySelectorAll('[data-s5-cat]').forEach(b => b.addEventListener('click', () => loadPosts(b.dataset.s5Cat, document.getElementById('s5-search')?.value || '')));
      document.getElementById('s5-search-btn')?.addEventListener('click', () => loadPosts('', document.getElementById('s5-search')?.value || ''));
      document.getElementById('s5-search')?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); loadPosts('', e.target.value); } });
    } else if (hash === '#/profile') {
      if (!App.state.user) { view.innerHTML = shell('<h1 class="text-2xl font-bold text-white mb-3">请先登录</h1><p class="s5-muted mb-5">登录后即可编辑昵称和头像。</p><button class="s5-btn" onclick="App.openModal(\'login\')">登录 / 注册</button>'); return; }
      view.innerHTML = profileView();
      let avatarFile = null;
      const fileInput = document.getElementById('s5-avatar-file');
      fileInput?.addEventListener('change', () => {
        const f = fileInput.files?.[0]; if (!f) return;
        if (!f.type.startsWith('image/')) { App.showToast('请选择图片文件', 'bg-red-600'); fileInput.value = ''; return; }
        if (f.size > 2 * 1024 * 1024) { App.showToast('图片不能超过 2 MB', 'bg-red-600'); fileInput.value = ''; return; }
        avatarFile = f;
        document.getElementById('s5-avatar-preview').src = URL.createObjectURL(f);
      });
      document.getElementById('s5-profile-save')?.addEventListener('click', async () => {
        const status = document.getElementById('s5-profile-status');
        const nickname = document.getElementById('s5-nickname').value.trim();
        const bio = document.getElementById('s5-bio').value.trim();
        if (!nickname) { status.textContent = '昵称不能为空。'; return; }
        const btn = document.getElementById('s5-profile-save'); btn.disabled = true; status.textContent = '正在保存…';
        try {
          const r = await api('/users/profile', {method:'PATCH', body:JSON.stringify({nickname,bio})});
          if (r.user) { App.state.user = {...App.state.user,...r.user}; localStorage.setItem('sosks5_user', JSON.stringify(App.state.user)); }
          if (avatarFile) {
            const form = new FormData(); form.append('avatar', avatarFile);
            const ar = await api('/users/avatar', {method:'POST', body:form});
            if (ar.user) { App.state.user = {...App.state.user,...ar.user}; localStorage.setItem('sosks5_user', JSON.stringify(App.state.user)); }
          }
          status.textContent = '保存成功。'; App.renderNav();
        } catch (e) { status.textContent = '资料暂时未能保存，请稍后重试。'; }
        finally { btn.disabled = false; }
      });
    } else if (hash === '#/traffic/new') {
      view.innerHTML = newPostView();
      document.getElementById('s5-post-form')?.addEventListener('submit', async e => {
        e.preventDefault(); const form = e.currentTarget; const status = document.getElementById('s5-post-status');
        if (!App.state.user) { status.textContent = '请先登录后再发布。'; App.openModal('login'); return; }
        const fd = new FormData(form);
        const body = {title:fd.get('title'),url:fd.get('url'),category:fd.get('category'),description:fd.get('description'),tags:String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean)};
        try { const r = await api('/traffic/posts',{method:'POST',body:JSON.stringify(body)}); status.textContent = r.message || '发布成功'; setTimeout(()=>location.hash='#/traffic',700); }
        catch(err) { status.textContent = '内容暂未发布，请稍后重试。'; }
      });
    }
  }

  const addLinks = () => {
    const nav = document.querySelector('#navbar .hidden.md\\:flex.items-center');
    const drawer = document.querySelector('#user-drawer .p-2.space-y-1');
    if (drawer && !drawer.querySelector('[data-s5-profile]')) {
      const a = document.createElement('a'); a.href = '#/profile'; a.dataset.s5Profile = '1'; a.className = 'block px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-slate-900 transition'; a.textContent = '个人资料 / 昵称头像'; drawer.prepend(a);
    }
  };
  const oldRouter = App.router.bind(App);
  App.router = function() {
    addLinks();
    const h = location.hash || '#/';
    if (['#/traffic','#/traffic/new','#/profile'].includes(h)) { route(); this.toggleDrawer(false); return; }
    return oldRouter();
  };
  window.addEventListener('hashchange', () => { addLinks(); route(); });
  document.addEventListener('DOMContentLoaded', addLinks);
  window.SOSKS5Community = { loadPosts };
})();