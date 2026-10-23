document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('hot-products');
    if (!grid) return;

    // 模拟 PRD 里要求的复杂 SKU 数据结构 (后续你接后端直接替换)
    const mockSkus = [
        {
            id: 1,
            platform: 'Telegram',
            title: 'Telegram [成品号] 🇺🇸+1 USA API Login (30d±)',
            icon: '✈️',
            tags: ['🔥 Hot', 'iOS Real Device'],
            price: 1.35,
            stock: 1981,
            warranty: '12h',
            warning: '⚠️ API Login Only, App restricted'
        },
        {
            id: 2,
            platform: 'Threads',
            title: 'Threads [Global] High Quality Account (180d+)',
            icon: '🧵',
            tags: ['New', 'Premium'],
            price: 3.50,
            stock: 420,
            warranty: '24h',
            warning: ''
        },
        {
            id: 3,
            platform: 'ChatGPT',
            title: 'ChatGPT Plus (Shared) 1-Month Account',
            icon: '🤖',
            tags: ['Blind Box'],
            price: 8.00,
            stock: 85,
            warranty: '12h',
            warning: '⚠️ Blind box country distribution'
        },
        {
            id: 4,
            platform: 'Apple ID',
            title: 'Apple ID [US] Region Payment Method Attached',
            icon: '🍎',
            tags: [],
            price: 2.99,
            stock: 0, // 测试售罄
            warranty: '12h',
            warning: ''
        }
    ];

    grid.innerHTML = mockSkus.map(sku => {
        const isSoldOut = sku.stock <= 0;
        return `
            <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-3xl">${sku.icon}</div>
                        <span class="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">${sku.platform}</span>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2 min-h-[40px]">${sku.title}</h3>
                    
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${sku.tags.map(t => `<span class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">${t}</span>`).join('')}
                    </div>
                    
                    ${sku.warning ? `<div class="text-[10px] text-red-500 bg-red-50 p-1.5 rounded mb-3">${sku.warning}</div>` : ''}
                    
                    <div class="text-xs text-gray-500 flex justify-between border-t border-gray-100 pt-3 mt-3">
                        <span>Stock: <strong class="${isSoldOut ? 'text-red-500' : 'text-green-500'}">${sku.stock}</strong></span>
                        <span>Warranty: ${sku.warranty}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                    <div class="text-xl font-bold text-gray-900">$${sku.price.toFixed(2)}</div>
                    <button class="px-4 py-2 rounded-lg text-sm font-bold text-white transition ${isSoldOut ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}" ${isSoldOut ? 'disabled' : ''}>
                        ${isSoldOut ? 'Sold Out' : 'Buy Now'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
});
