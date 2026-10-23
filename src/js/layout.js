document.getElementById('app-header').innerHTML = `
<header class="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm border-b border-gray-100">
    <div class="flex items-center gap-2">
        <img src="./assets/sok.png" class="w-8 h-8 rounded-lg shadow-sm" alt="socks5">
        <h1 class="text-xl font-black text-gray-800 tracking-tight">socks5</h1>
    </div>
    <div class="flex items-center gap-2">
        <a href="./auth/login.html" class="px-3.5 py-1.5 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 bg-white">登录</a>
        <a href="./auth/register.html" class="px-3.5 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md shadow-blue-500/30">注册</a>
    </div>
</header>
`;

// 去掉了手写的悬浮球，保留底部导航
document.getElementById('app-footer').innerHTML = `
<div class="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-around py-2.5 z-50 pb-safe">
    <a href="./index.html" class="flex flex-col items-center text-blue-600">
        <svg class="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-[10px] font-bold">首页</span>
    </a>
    <a href="./query/console.html" class="flex flex-col items-center text-gray-400 hover:text-blue-600 transition">
        <svg class="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <span class="text-[10px]">查询</span>
    </a>
</div>
`;
