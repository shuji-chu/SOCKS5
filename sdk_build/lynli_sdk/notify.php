<?php
require 'config.php';
require 'LynliPay.Core.php';

$config = require 'config.php';
$pay = new LynliPay($config);

// 获取平台发来的 GET 参数
$params = $_GET;

// 1. 验证签名 (防伪造、防篡改)
if (!$pay->verifySign($params)) {
    // 验签失败，直接退出
    die('error_sign');
}

// 2. 核对订单状态
if (isset($params['trade_status']) && $params['trade_status'] === 'TRADE_SUCCESS') {
    $out_trade_no = $params['out_trade_no'];
    $trade_no = $params['trade_no'];
    $money = $params['money'];

    // ==========================================
    // 3. 在这里写您的业务逻辑
    // - 查询数据库判断订单是否已经处理过 (幂等性)
    // - 核对金额是否与订单金额一致
    // - 修改订单状态为已付款
    // - 执行发货逻辑
    // ==========================================
    
    // 处理成功，必须返回纯文本 success
    echo 'success';
    exit;
}

// 状态不是成功，返回 fail
echo 'fail';
?>
