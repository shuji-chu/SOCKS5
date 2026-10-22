<?php
// ==========================================
// SOCKS5 支付网关 - 商户配置文件
// ==========================================
return [
    // 接口网关地址（末尾不要加斜杠）
    'api_url' => 'https://web.lynli.me/api/pay',
    
    // 您的商户 ID (在商户后台-API信息页查看)
    'pid' => '10001',
    
    // 平台公钥 (用于验签，平台提供)
    'platform_public_key' => 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1x...',
    
    // 商户私钥 (用于生成签名，请严格保密)
    'merchant_private_key' => 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...'
];
