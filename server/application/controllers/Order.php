<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/8
 * Time: 上午11:00
 */

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

require_once ('/data/release/php-weapp-demo/application/controllers/BaseController.php');

class Order extends BaseController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->library('service/orderService');
        $this->load->model('ProductModel');
        $this->load->model('OrderModel');
    }

    /**
     * 1. 获取post数据
     * 2. 获取open_id? 存在缓存里吗？
     * 3. 调用下单api
     */
    public function placeOrder()
    {
        $data = $this->checkProducts();
        $oProducts = $data['products'];
        if (array_key_exists('orderInfo', $data)) {
            $orderInfo = json_decode($data['orderInfo'], true);
        } else {
            $orderInfo = '{}';
        }

        $result = LoginService::check();
        if ($result['loginState'] === Constants::S_AUTH) {
            $openid = $result['userinfo']['openId'];
            $this->json($this->orderservice->place($openid, $oProducts, $orderInfo));
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }


    public function getSummaryByUser($offset = 0)
    {
        if ($offset < 0) {
            show_error("offset必须大于0");
        }
        $result = LoginService::check();
        if ($result['loginState'] === Constants::S_AUTH) {
            $openid = $result['userinfo']['openId'];
            $paginateOrders = (new OrderModel())->getOrders($openid, $offset);
            if (count($paginateOrders) >= 10) {
                $offset = $offset + 10;
            }
            $this->json([
                'data' => $paginateOrders,
                'current_offset' => $offset
            ]);
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }

    public function getDetail($id)
    {
        if (!$this->checkPositive($id))
        {
            show_error("id必须为正数");
        }
        $order = (new OrderModel())->getByID($id);
        unset($order['prepay_id'], $order['update_time'],$order['delete_time'],$order['open_id']);
        $this->json($order);

    }

    //先进行数据检查，通过后返回数据
    private function checkProducts()
    {
        if (!$_POST && $this->input->get_request_header('Content-Type') == "application/json") {
            $data = (array) json_decode($this->input->raw_input_stream, true);
        } else {
            $data = $this->input->post();
        }
        if (!array_key_exists('products', $data)) {
            show_error("必须参数为空");
        }
        $products = $data['products'];
        if (empty($products)) {
            show_error("参数不能为空");
        }
        if (!is_array($products)) {
            show_error("传入的不是数组");
        }
        foreach ($products as $item) {
            $this->checkProduct($item);
        }
        return $data;
    }

    private function checkProduct($item)
    {
        if (!array_key_exists('product_id', $item) || !array_key_exists('qty', $item)) {
            show_error("商品列表参数不存在");
        }
        if (!$this->checkPositive($item['product_id']) ||
            !$this->checkPositive($item['qty']))  {
            show_error("非法的商品列表参数必须为正整数");
        }
    }
}