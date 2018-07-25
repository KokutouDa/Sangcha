<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/18
 * Time: 下午12:09
 */

require_once ('/data/release/php-weapp-demo/application/libraries/wxpay/WxPay.Api.php');
require_once ('/data/release/php-weapp-demo/application/libraries/wxpay/WxPay.Notify.php');

class WxNotify extends WxPayNotify
{
    //支付成功
    const PAID_CODE = 2;
    /**
     * @param array $data 回调解释出的参数
     * @param string $msg 如果回调处理失败，可以将错误信息输出到该方法
     * @return true 回调出来完成不需要继续回调，false回调处理未完成需要继续回调
     */
    public function NotifyProcess($data, &$msg)
    {
        if ($data['result_code'] == "SUCCESS") {
            $orderNo = $data['out_trade_no'];
            $db = DB();
            $db->trans_start();

            $order = (new OrderModel())->getByOrderNum($orderNo);
            if ($order['status'] == 1) {
                $this->updateOrderStatus($order['id']);
            }
            $db->trans_complete();
            if ($db->trans_status() === FALSE)
            {
                return false;
            }

        }
        return true;
    }

    private function updateOrderStatus($id)
    {
        $status = 2;
        $data = array('status' => $status);
        (new OrderModel())->updateById($id, $data);
    }

}