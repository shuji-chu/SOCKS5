document.addEventListener('DOMContentLoaded', async () => {
    const list = document.getElementById('product-list');
    list.innerHTML = '<div class="text-center py-10 text-gray-400 text-sm">加载中...</div>';
    
    try {
        const res = await fetch("https://lynli.kz.ci/api/products");
        const data = await res.json();
        const products = Array.isArray(data) ? data : (data.data || []);

        if (products.length === 0) {
            list.innerHTML = '<div class="text-center py-10 text-gray-400 text-sm">暂无商品</div>';
            return;
        }

        list.innerHTML = products.map(p => `
            <a href="./product/product-detail.html?id=${p.id}" class="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3 active:scale-[0.98] transition">
                <div class="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 font-bold text-xl">TG</div>
                <div class="flex-1">
                    <h3 class="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">${p.title}</h3>
                    <div class="flex gap-1 mb-2">
                        <span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">${p.category}</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <div class="text-red-500 font-bold"><span class="text-xs">¥</span>${p.price}<span class="text-xs font-normal text-gray-400">起</span></div>
                        <div class="text-[10px] text-gray-400 flex flex-col items-end leading-tight">
                            <span>库存 ${p.stock}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <button class="bg-blue-500 text-white text-xs px-3 py-1.5 rounded shadow shadow-blue-500/30">购买</button>
                </div>
            </a>
        `).join('');

    } catch(e) {
        console.error(e);
        list.innerHTML = '<div class="text-center py-10 text-red-500 text-sm">网络加载失败</div>';
    }
});
