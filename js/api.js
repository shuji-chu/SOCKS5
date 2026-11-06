(function(){
'use strict';
const API_BASE='https://api.lynli.me';
const API_PREFIX='/api/v1';
const TOKEN_KEY='lynli_token';
function token(){try{return localStorage.getItem(TOKEN_KEY)||''}catch(_){return ''}}
function saveToken(value){
 if(typeof value!=='string'||!value.trim())throw new Error('服务端未返回登录凭证');
 localStorage.setItem(TOKEN_KEY,value.trim());
}
function clearToken(){try{localStorage.removeItem(TOKEN_KEY)}catch(_){}}
function unwrap(value){
 let result=value;
 for(let i=0;i<8&&result&&typeof result==='object'&&!Array.isArray(result)&&Object.prototype.hasOwnProperty.call(result,'data');i++)result=result.data;
 return result;
}
function responseMessage(payload){
 if(!payload||typeof payload!=='object')return '';
 for(const value of [payload.message,payload.msg,payload.detail,payload.error]){
  if(typeof value==='string'&&value.trim())return value.trim();
  if(value&&typeof value==='object'&&typeof value.message==='string'&&value.message.trim())return value.message.trim();
 }
 return '';
}
function hasFailureFlag(payload){
 if(!payload||typeof payload!=='object')return false;
 const status=String(payload.status??'').toLowerCase(),code=payload.code,message=responseMessage(payload);
 const failureMessage=/(频繁|失败|错误|无效|不正确|不能为空|未通过|已存在|已注册|已过期|禁止|拒绝|不足|invalid|incorrect|unauthorized|forbidden|failed)/i.test(message);
 return payload.success===false||['fail','failed','error'].includes(status)||failureMessage||
  (typeof code==='number'&&code>=400)||(typeof code==='string'&&/^\d{3,}$/.test(code)&&Number(code)>=400);
}
function redirectToLogin(){
 clearToken();
 const path=String(location.pathname||'');
 if(!/(^|\/)login\.html$/i.test(path)&&!/(^|\/)register\.html$/i.test(path))location.replace('./login.html');
}
async function request(path,options={}){
 const headers=new Headers(options.headers||{});
 headers.set('Accept','application/json');
 const currentToken=token();
 if(currentToken)headers.set('Authorization','Bearer '+currentToken);
 let body=options.body;
 if(body!==undefined&&body!==null&&typeof body!=='string'&&!(body instanceof FormData)){
  headers.set('Content-Type','application/json');
  body=JSON.stringify(body);
 }
 let response;
 try{response=await fetch(API_BASE+API_PREFIX+path,{method:options.method||'GET',headers,body,credentials:'omit'})}
 catch(_){throw new Error('网络连接失败，请检查网络后重试')}
 let payload;
 try{payload=await response.json()}
 catch(_){
  if(response.status===401){redirectToLogin();throw new Error('登录状态已失效，请重新登录')}
  throw new Error('服务端返回格式异常（HTTP '+response.status+'）');
 }
 if(response.status===401){
  redirectToLogin();
  throw new Error(responseMessage(payload)||'登录状态已失效，请重新登录');
 }
 const message=responseMessage(payload);
 if(options.requireCodeOne&&(payload.code!==1||payload.success===false||/(错误|已注册)/.test(message))){
  const error=new Error(message||'验证码发送失败');
  error.status=response.status;error.payload=payload;throw error;
 }
 if(!response.ok||hasFailureFlag(payload)){
  const error=new Error(message||'请求失败（HTTP '+response.status+'）');
  error.status=response.status;error.payload=payload;throw error;
 }
 return unwrap(payload);
}
function credential(data){
 const candidates=[data,data&&data.auth_data,data&&data.data,data&&data.user];
 for(const item of candidates){
  if(typeof item==='string'&&item.trim())return item;
  if(item&&typeof item==='object'){
   const value=item.token||item.access_token||item.accessToken||item.auth_token;
   if(typeof value==='string'&&value.trim())return value;
  }
 }
 return '';
}
async function login(email,password){
 const data=await request('/passport/auth/login',{method:'POST',auth:false,body:{email,password}});
 saveToken(credential(data));return data;
}
function sendCode(email){
 const url=API_BASE+API_PREFIX+'/passport/auth/send-code';
 const body=JSON.stringify({email:email});
 console.log('[send-code] POST',url,{email});
 return request('/passport/auth/send-code',{
  method:'POST',
  auth:false,
  headers:{'Content-Type':'application/json'},
  body,
  requireCodeOne:true
 });
}
async function register(input){
 const body={email:input.email,code:input.code,password:input.password};
 if(input.invite_code&&String(input.invite_code).trim())body.invite_code=String(input.invite_code).trim();
 const data=await request('/passport/auth/register',{method:'POST',auth:false,body});
 saveToken(credential(data));return data;
}
function getPlans(){return request('/user/plan/fetch',{method:'GET',auth:false})}
function getConfig(){return request('/config',{method:'GET',auth:false})}
function getUserInfo(){return request('/user/info')}
function getSubscription(){return request('/user/getSubscribe')}
function createOrder(payload){return request('/user/order/save',{method:'POST',body:payload})}
function checkoutOrder(tradeNo){return request('/user/order/checkout',{method:'POST',body:{trade_no:tradeNo}})}
window.API_BASE=API_BASE;
window.S5Api=Object.freeze({request,unwrap,token,saveToken,clearToken,login,sendCode,register,getPlans,getConfig,getUserInfo,getSubscription,createOrder,checkoutOrder});
})();