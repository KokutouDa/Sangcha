<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/16
 * Time: 下午9:50
 */


require_once ('/data/release/php-weapp-demo/application/libraries/wxpay/WxPay.Api.php');

class PayService
{
    private $orderId,
        $orderNum,
        $openid;

    public function __construct($params)
    {
        $this->orderId = $params['id'];
        $this->openid = $params['openid'];
    }

    public function pay()
    {
        $order = (new OrderModel())->getByID($this->orderId);
        $this->orderNum = $order['order_num'];
        return $this->makeWxPreOrder($order['total_price']);
    }

    /**
     *  生成微信预订单
     * @param int $totalPrice: 订单的总价格
     * @return \WxPayUnifiedOrder|\成功时返回，其他抛异常
     */
    private function makeWxPreOrder($totalPrice)
    {
        if (!$this->openid) {
            show_error("无效令牌或过期");
        }

        $wxOrderData = new WxPayUnifiedOrder();
        $wxOrderData->SetOut_trade_no($this->orderNum);
        $wxOrderData->SetTrade_type('JSAPI');
        $wxOrderData->SetTotal_fee($totalPrice * 100);
        $wxOrderData->SetOpenid($this->openid);
        $wxOrderData->SetBody('丧茶长江路店');
        $notifyUrl = (new CI_Config())->item('pay_back_url');
        $wxOrderData->SetNotify_url($notifyUrl);
        return $this->getPaySignature($wxOrderData);
    }

    private function getPaySignature($wxOrderData)
    {
        $wxOrder = WxPayApi::unifiedOrder($wxOrderData);
        $this->savePrepayId($wxOrder);
        return $this->sign($wxOrder);
    }

    private function savePrepayId($wxOrder)
    {
        $prepayId = $wxOrder['prepay_id'];
        $data = array('prepay_id' => $prepayId);
        (new OrderModel())->updateById($this->orderId, $data);
    }

    /**
     * @param $wxOrder
     * @return array
     */
    private function sign($wxOrder)
    {
        $jsApiPay = new WxPayJsApiPay();
        $appId = (new CI_Config())->item('app_id');
        $jsApiPay->SetAppid($appId);
        $jsApiPay->SetTimeStamp((string)time());
        $jsApiPay->SetPackage('prepay_id=' . $wxOrder['prepay_id']);
        $jsApiPay->SetSignType('MD5');
        $jsApiPay->SetNonceStr(WxPayApi::getNonceStr());
        $jsApiPay->SetPaySign($jsApiPay->MakeSign());
        $values = $jsApiPay->GetValues();
        unset($values['appId']);
        return $values;
    }

}