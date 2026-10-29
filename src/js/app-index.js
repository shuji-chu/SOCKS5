// 首页专属交互：仅处理静态 UI，不发起网络请求。
(function(){'use strict';document.querySelectorAll('.announcement-track').forEach(track=>{track.setAttribute('aria-label','平台公告静态示例')});})();