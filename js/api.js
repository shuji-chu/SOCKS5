(function(){
'use strict';
const API_BASE='https://api.lynli.me';
const API_PREFIX='/api/v1';
const TOKEN_KEYS=['sosks5_token','tgx_token','lynli_token'];
function token(){for(const key of TOKEN_KEYS){const value=localStorage.getItem(key)||sessionStorage.getItem(key);if(value)return value}return ''}
function saveToken(value){if(!value)throw new Error('服务端未返回登录凭证');TOKEN_KEYS.forEach(key=>localStorage.setItem(key,value));}
function clearToken(){TOKEN_KEYS.forEach(key=>{localStorage.removeItem(key);sessionStorage.removeItem(key)});localStorage.removeItem('sosks5_user');localStorage.removeItem('tgx_user')}
function unwrap(value){let result=value;for(let i=0;i<5&&result&&typeof result==='object'&&result.data!==undefined;i++)result=result.data;return result}
async function request(path,options={}){
 const headers=new Headers(options.headers||{});headers.set('Accept','application/json');
 const auth=options.auth!==false&&token();if(auth)headers.set('Authorization','Bearer '+auth);
 let body=options.body;if(body!==undefined&&body!==null&&typeof body!=='string'&&!(body instanceof FormData)){headers.set('Content-Type','application/json');body=JSON.stringify(body)}
 let response;try{response=await fetch(API_BASE+API_PREFIX+path,{method:options.method||'GET',headers,body,credentials:'omit'})}catch(error){throw new Error('网络连接失败，请检查网络后重试')}
 let payload;try{payload=await response.json()}catch(_){throw new Error('服务端返回格式异常（HTTP '+response.status+'）')}
 const message=payload&&(payload.message||payload.msg||payload.detail||payload.error);
 if(!response.ok||payload.success===false||payload.status==='fail'||(payload.http_status!==undefined&&Number(payload.http_status)!==200)){const error=new Error(String(message||'请求失败（HTTP '+response.status+'）'));error.status=response.status;throw error}
 return unwrap(payload)
}
function login(email,password){return request('/passport/auth/login',{method:'POST',auth:false,body:{email,password}}).then(data=>{saveToken(data.token||data.auth_data||data.access_token);return data})}
function sendCode(email){return request('/passport/auth/send-code',{method:'POST',auth:false,body:{email}})}
function register(input){const body={email:input.email,code:input.code,password:input.password};if(input.invite_code)body.invite_code=input.invite_code;return request('/passport/auth/register',{method:'POST',auth:false,body}).then(data=>{saveToken(data.token||data.auth_data||data.access_token);return data})}
function getPlans(){return request('/user/plan/fetch',{method:'GET',auth:false})}
function getConfig(){return request('/config',{method:'GET',auth:false})}
function getUserInfo(){return request('/user/info')}
function getSubscription(){return request('/user/getSubscribe')}
function createOrder(payload){return request('/user/order/save',{method:'POST',body:payload})}
function checkoutOrder(tradeNo){return request('/user/order/checkout',{method:'POST',body:{trade_no:tradeNo}})}
window.API_BASE=API_BASE;
window.S5Api=Object.freeze({request,unwrap,token,saveToken,clearToken,login,sendCode,register,getPlans,getConfig,getUserInfo,getSubscription,createOrder,checkoutOrder});
})();