<?php
/**
 * SOCKS5 聚合支付核心 SDK (V2.1)
 * 支持 RSA 签名与验签
 */
class LynliPay {
    private $api_url;
    private $pid;
    private $public_key;
    private $private_key;

    public function __construct($config) {
        $this->api_url = rtrim($config['api_url'], '/');
        $this->pid = $config['pid'];
        $this->public_key = $config['platform_public_key'];
        $this->private_key = $config['merchant_private_key'];
    }

    /**
     * 生成 RSA 签名
     */
    public function getSign($params) {
        ksort($params); // 按键名 ASCII 升序排序
        $signStr = '';
        foreach ($params as $k => $v) {
            // 排除空值和 sign/sign_type
            if ($v !== '' && $k != 'sign' && $k != 'sign_type') {
                $signStr .= $k . '=' . $v . '&';
            }
        }
        $signStr = rtrim($signStr, '&'); // 去掉末尾的 &
        
        $res = openssl_get_privatekey($this->private_key);
        openssl_sign($signStr, $sign, $res, OPENSSL_ALGO_SHA256);
        openssl_free_key($res);
        
        return base64_encode($sign);
    }

    /**
     * 验证平台异步通知签名
     */
    public function verifySign($params) {
        if (!isset($params['sign'])) return false;
        $sign = $params['sign'];
        
        ksort($params);
        $signStr = '';
        foreach ($params as $k => $v) {
            if ($v !== '' && $k != 'sign' && $k != 'sign_type') {
                $signStr .= $k . '=' . $v . '&';
            }
        }
        $signStr = rtrim($signStr, '&');
        
        $res = openssl_get_publickey($this->public_key);
        $result = openssl_verify($signStr, base64_decode($sign), $res, OPENSSL_ALGO_SHA256);
        openssl_free_key($res);
        
        return $result === 1;
    }

    /**
     * 统一下单接口
     */
    public function submit($out_trade_no, $name, $money, $notify_url, $return_url, $type = 'alipay', $param = '') {
        $params = [
            'pid' => $this->pid,
            'type' => $type,
            'out_trade_no' => $out_trade_no,
            'notify_url' => $notify_url,
            'return_url' => $return_url,
            'name' => $name,
            'money' => $money,
            'param' => $param,
            'timestamp' => time()
        ];
        
        $params['sign'] = $this->getSign($params);
        $params['sign_type'] = 'RSA';

        return $this->sendPost('/create', $params);
    }

    /**
     * 订单查询接口
     */
    public function query($out_trade_no) {
        $params = [
            'pid' => $this->pid,
            'out_trade_no' => $out_trade_no,
            'timestamp' => time()
        ];
        
        $params['sign'] = $this->getSign($params);
        $params['sign_type'] = 'RSA';

        return $this->sendPost('/query', $params);
    }

    /**
     * 发送 HTTP POST 请求
     */
    private function sendPost($path, $data) {
        $url = $this->api_url . $path;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            return ['code' => 500, 'msg' => '请求失败: ' . curl_error($ch)];
        }
        
        curl_close($ch);
        return json_decode($response, true);
    }
}
