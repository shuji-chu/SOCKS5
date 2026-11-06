(function(){
'use strict';
const API_BASE='https://api.lynli.me';
const API_PREFIX='/api/v1';
const TOKEN_KEYS=['lynli_token','sosks5_token','tgx_token'];
function token(){for(const key of TOKEN_KEYS){const value=localStorage.getItem(key)||sessionStorage.getItem(key);if(value)return value}return ''}
function saveToken(value){if(!value||typeof value!=='string')throw new Error('服务端未返回登录凭证');localStorage.setItem('lynli_token',value);localStorage.setItem('sosks5_token',value);localStorage.setItem('tgx_token',value)}
function clearToken(){TOKEN_KEYS.forEach(key=>{localStorage.removeItem(key);sessionStorage.removeItem(key)});localStorage.removeItem('sosks5_user');localStorage.removeItem('tgx_user')}
function unwrap(value){let result=value;for(let i=0;i<6&&result&&typeof result==='object'&&result.data!==undefined;i++)result=result.data;return result}
function responseMessage(payload){if(!payload||typeof payload!=='object')return '';const candidates=[payload.message,payload.msg,payload.detail,payload.error];for(const value of candidates){if(typeof value==='string'&&value.trim())return value.trim();if(value&&typeof value==='object'&&typeof value.message==='string')return value.message.trim()}return ''}
function hasFailureFlag(payload){if(!payload||typeof payload!=='object')return false;const status=String(payload.status??'').toLowerCase();const code=payload.code;return payload.success===false||['fail','failed','error'].includes(status)||(typeof code==='number'&&code>=400)||(typeof code==='string'&&/^\d{3,}$/.test(code)&&Number(code)>=400)}
async function request(path,options={}){
 const headers=new Headers(options.headers||{});headers.set('Accept','application/json');
 const auth=options.auth!==false&&token();if(auth)headers.set('Authorization','Bearer '+auth);
 let body=options.body;if(body!==undefined&&body!==null&&typeof body!=='string'&&!(body instanceof FormData)){headers.set('Content-Type','application/json');body=JSON.stringify(body)}
 let response;try{response=await fetch(API_BASE+API_PREFIX+path,{method:options.method||'GET',headers,body,credentials:'omit'})}catch(_){throw new Error('网络连接失败，请检查网络后重试')}
 let payload;try{payload=await response.json()}catch(_){throw new Error('服务端返回格式异常（HTTP '+response.status+'）')}
 const message=responseMessage(payload);
 if(!response.ok||hasFailureFlag(payload)){const error=new Error(message||'请求失败（HTTP '+response.status+'）');error.status=response.status;error.payload=payload;throw error}
 return unwrap(payload)
}
function credential(data){const value=data&&(data.token||data.auth_data||data.access_token||data.accessToken);if(typeof value==='string')return value;if(value&&typeof value==='object')return value.token||value.access_token||'';return ''}
async function login(email,password){const data=await request('/passport/auth/login',{method:'POST',auth:false,body:{email,password}});saveToken(credential(data));return data}
function sendCode(email){return request('/passport/auth/send-code',{method:'POST',auth:false,body:{email}})}
async function register(input){const body={email:input.email,code:input.code,password:input.password};if(input.invite_code)body.invite_code=input.invite_code;const data=await request('/passport/auth/register',{method:'POST',auth:false,body});saveToken(credential(data));return data}
function getPlans(){return request('/user/plan/fetch',{method:'GET',auth:false})}
function getConfig(){return request('/config',{method:'GET',auth:false})}
function getUserInfo(){return request('/user/info')}
function getSubscription(){return request('/user/getSubscribe')}
function createOrder(payload){return request('/user/order/save',{method:'POST',body:payload})}
function checkoutOrder(tradeNo){return request('/user/order/checkout',{method:'POST',body:{trade_no:tradeNo}})}
window.API_BASE=API_BASE;
window.S5Api=Object.freeze({request,unwrap,token,saveToken,clearToken,login,sendCode,register,getPlans,getConfig,getUserInfo,getSubscription,createOrder,checkoutOrder});
})();