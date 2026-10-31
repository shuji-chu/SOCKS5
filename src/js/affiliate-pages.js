/* Shared affiliate/account financial bindings. All displayed money is CNY. */
(function () {
  'use strict';
  const API_BASE = String(window.SOSKS5_API_BASE || 'https://web.lynli.me').replace(/\/+$/, '') + '/api/v1';
  const token = () => localStorage.getItem('sosks5_token') || localStorage.getItem('tgx_token') || sessionStorage.getItem('sosks5_token') || sessionStorage.getItem('tgx_token') || '';
  function unwrap(v) { let x=v; for(let i=0;i<6 && x && typeof x==='object' && x.data!==undefined;i++) x=x.data; return x || {}; }
  async function get(path) {
    const t=token(); if(!t) throw new Error('登录状态已失效，请重新登录');
    const r=await fetch(API_BASE+path,{headers:{Accept:'application/json',Authorization:'Bearer '+t},signal:AbortSignal.timeout?AbortSignal.timeout(12000):undefined});
    let b={}; try{b=await r.json()}catch(_){throw new Error('服务器返回格式错误')}
    if(r.status===401 || b.code===401) {
      ['sosks5_token','tgx_token','socks5_token','sosks5_user','tgx_user','socks5_user'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      throw new Error('登录状态已失效，请重新登录');
    }
    if(!r.ok || b.success===false || b.status==='fail' || b.code!==undefined && ![0,200].includes(Number(b.code))) throw new Error(b.message||b.msg||'数据读取失败（HTTP '+r.status+'）');
    return unwrap(b);
  }
  function find(root, keys) {
    const wanted=new Set(keys.map(k=>k.toLowerCase().replace(/[-_]/g,''))), seen=new Set();
    function walk(v){if(!v||typeof v!=='object'||seen.has(v))return null;seen.add(v);
      for(const [k,x] of Object.entries(v)) if(wanted.has(k.toLowerCase().replace(/[-_]/g,'')) && x!==null && x!==undefined && String(x).trim()!=='') return x;
      for(const x of Object.values(v)){const y=walk(x);if(y!==null&&y!==undefined)return y;} return null;
    } return walk(root);
  }
  function cny(root, yuanKeys, usdtKeys, centKeys) {
    let v=find(root,yuanKeys); if(v!==null)return Number.isFinite(Number(v))?'¥'+Number(v).toFixed(2):'¥—';
    v=find(root,usdtKeys); if(v!==null)return Number.isFinite(Number(v))?'¥'+(Number(v)*8).toFixed(2):'¥—';
    v=find(root,centKeys); if(v!==null)return Number.isFinite(Number(v))?'¥'+(Number(v)/100).toFixed(2):'¥—';
    return '¥—';
  }
  function list(v){if(Array.isArray(v))return v;for(const k of ['list','items','records','customers','users','rows','results'])if(Array.isArray(v&&v[k]))return v[k];return [];}
  function shortId(root){const v=String(find(root,['short_id','shortId','user_short_id','userShortId','invite_code'])||'').trim();return /^\d{5}$/.test(v)?v:'';}
  function referral(id){return id ? location.origin+'/login.html?mode=register&short_id='+encodeURIComponent(id) : '';}
  function set(id,value){const el=document.getElementById(id);if(el)el.textContent=value;}
  function toast(msg){let el=document.getElementById('affiliateToast');if(!el){el=document.createElement('div');el.id='affiliateToast';el.style.cssText='position:fixed;z-index:99999;left:50%;bottom:24px;transform:translateX(-50%);max-width:calc(100vw - 32px);padding:11px 16px;border-radius:12px;background:#0a3f83;color:#fff;font-size:13px;font-weight:700;box-shadow:0 10px 28px #0055ff22';document.body.appendChild(el)}el.textContent=msg;el.hidden=false;clearTimeout(window.__affiliateToastTimer);window.__affiliateToastTimer=setTimeout(()=>el.hidden=true,3200);}
  async function load() {
    if(!token()){location.href='../../login.html?redirect='+encodeURIComponent(location.pathname.split('/').pop());return;}
    const jobs=await Promise.allSettled([get('/user/info'),get('/user/invite/fetch'),get('/user/invite/customers')]);
    const failed=jobs.find(x=>x.status==='rejected' && /登录状态/.test(x.reason&&x.reason.message||'')); if(failed){location.href='../login.html?redirect='+encodeURIComponent(location.pathname.split('/').pop());return;}
    const info=jobs[0].status==='fulfilled'?jobs[0].value:{};
    const stats=jobs[1].status==='fulfilled'?jobs[1].value:{};
    const customers=jobs[2].status==='fulfilled'?list(jobs[2].value):[];
    const user=info.user||info.profile||info.account||info.member||info;
    const id=shortId(info)||shortId(user);
    const url=referral(id);
    const inviteInput=document.getElementById('promo-link');
    if(inviteInput){inviteInput.value=url;inviteInput.placeholder=url?'':'账户接口尚未返回 5 位 short_id';}
    const inviteText=document.getElementById('commission-invite-url'); if(inviteText)inviteText.textContent=url||'暂未获取真实邀请链接';
    const copyButton=document.getElementById('copy-commission-invite'); if(copyButton)copyButton.onclick=()=>url?copy(url):toast('尚未获取真实 short_id，无法生成邀请链接');
    const count=find(stats,['invite_count','invited_count','total_invites','total','count']);
    const countValue=count!==null?String(count):(jobs[2].status==='fulfilled'?String(customers.length):'—');
    set('invite-count',countValue);
    const balance=cny({info,stats,user},
      ['balance_yuan','account_balance_yuan','wallet_balance_yuan'],
      ['balance_usdt','account_balance_usdt'],
      ['balance','account_balance','wallet_balance']);
    const available=cny({info,stats,user},
      ['available_commission_yuan','commission_balance_yuan','withdrawable_commission_yuan','available_balance_yuan'],
      ['available_commission_usdt','commission_balance_usdt','withdrawable_commission_usdt','available_balance_usdt','available_commission','commission_balance','withdrawable_commission','available_balance','commission_available'],
      []);
    const total=cny({info,stats,user},
      ['total_commission_yuan','commission_total_yuan','total_reward_yuan'],
      ['total_commission_usdt','commission_total_usdt','total_reward_usdt'],
      ['total_commission','commission_total','total_reward','commission']);
    const withdrawn=cny({info,stats,user},
      ['withdrawn_total_yuan','withdrawn_yuan','total_withdrawn_yuan'],
      ['withdrawn_total_usdt','withdrawn_usdt','total_withdrawn_usdt','withdrawn_total','withdrawn','total_withdrawn'],
      []);
    const locked=cny({info,stats,user},
      ['pending_commission_yuan','pending_balance_yuan','pending_reward_yuan'],
      ['pending_commission_usdt','pending_balance_usdt','pending_reward_usdt','pending_commission','pending_balance','pending_reward'],
      []);
    set('affiliate-account-balance',balance); set('affiliate-available-balance',available); set('affiliate-total-commission',total); set('affiliate-withdrawn-total',withdrawn); set('affiliate-pending-total',locked);
    set('available-balance',available); set('withdraw-modal-balance',available); set('withdraw-page-balance',available);
    const rateEls=document.querySelectorAll('[data-affiliate-rate]');rateEls.forEach(el=>el.textContent='15%');
    const note=document.getElementById('affiliate-data-status'); if(note)note.textContent=jobs.slice(0,2).some(x=>x.status==='rejected')?'部分分销数据暂时无法读取，金额以服务端返回为准':'数据已从账户与分销接口同步';
    const n=document.getElementById('commission-invite-note');if(n)n.textContent=id?'专属邀请码：'+id:'账户接口暂未返回 5 位 short_id';
    window.S5Affiliate={user,info,stats,customers,shortId:id,inviteUrl:url,availableCny:available};
  }
  async function copy(value){try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(value);else{const t=document.createElement('textarea');t.value=value;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();}toast('推广链接已复制');}catch(_){toast('复制失败，请检查浏览器权限');}}
  window.copyCommissionInvite=function(){const url=window.S5Affiliate&&window.S5Affiliate.inviteUrl;if(url)copy(url);else toast('尚未获取真实 short_id，无法生成邀请链接');};
  window.copyLink=function(){const el=document.getElementById('promo-link');if(el&&el.value)copy(el.value);else toast('尚未获取真实邀请链接');};
  window.submitWithdraw=function(){toast('提现申请接口尚未接入，未提交任何申请');};
  document.addEventListener('DOMContentLoaded',()=>load().catch(e=>{set('available-balance','¥—');set('affiliate-available-balance','¥—');set('withdraw-page-balance','¥—');const note=document.getElementById('affiliate-data-status');if(note)note.textContent='分销数据读取失败：'+(e.message||'请稍后重试');toast(e.message||'分销数据读取失败');}));
})();