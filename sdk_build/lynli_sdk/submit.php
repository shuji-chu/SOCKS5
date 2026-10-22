<?php
require 'config.php';
require 'LynliPay.Core.php';

// 1. 加载配置
$config = require 'config.php';
$pay = new LynliPay($config);

// 2. 组装您的订单信息
$out_trade_no = 'M' . time(); // 保证商户订单号唯一
$name = 'SOCKS5 测试商品';
$money = '0.01';
$type = 'alipay'; // 支持 alipay 或 usdt

// 3. 您的回调地址与跳转地址
$notify_url = 'https://yourdomain.com/notify.php';
$return_url = 'https://yourdomain.com/return.php';

// 4. 发起请求
$result = $pay->submit($out_trade_no, $name, $money, $notify_url, $return_url, $type);

// 5. 处理结果
if ($result && isset($result['code']) && $result['code'] === 0) {
    // 下单成功，跳转收银台
    header("Location: " . $result['payurl']);
    exit;
} else {
    echo "下单失败: " . ($result['msg'] ?? '未知错误');
}
?>
