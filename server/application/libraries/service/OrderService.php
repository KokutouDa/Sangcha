<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/10
 * Time: 下午10:47
 */

class OrderService
{
    //订单用户信息
    private $openid;
    //订单产品
    private $oProducts;
    //数据库中产品
    private $dbProducts;

    //下单
    public function place($openid, $oProducts, $orderInfo)
    {
        $this->openid = $openid;
        $this->oProducts = $oProducts;
        $this->dbProducts = $this->getProductsByOrder($oProducts);
        $orderStatus = $this->getOrderStatus();
        if (!$orderStatus['pass']) {
            $orderStatus['order_id'] = -1;
            return $orderStatus;
        }

        $orderSnap = $this->generateOrderSnap($orderStatus, $orderInfo);
        $order = $this->createOrder($orderSnap);
        $order['pass'] = true;
        return $order;

    }

    private function createOrder($orderSnap)
    {
        $db = DB();
        $db->trans_start();

        $orderNum = self::makeOrderNum();
        $data = array(
            'order_num' => $orderNum,
            'open_id' => $this->openid,
            'total_price' => $orderSnap['totalPrice'],
            'total_count' => $orderSnap['totalCount'],
            'snap_name' => $orderSnap['snapName'],
            'snap_img' => $orderSnap['snapImg'],
            'snap_products' => json_encode($orderSnap['snapProducts']),
            'message' => $orderSnap['message']
        );
        $orderModel = new OrderModel();
        $orderModel->insertData($data);

        $order = $orderModel->getByOrderNum($orderNum);
        $orderId = $order['id'];
        foreach ($this->oProducts as &$oProduct) {
            $oProduct['order_id'] = $orderId;
            $db->insert("order_product", $oProduct);
        }

        $db->trans_complete();
        return [
            'order_id' => $orderId,
            'order_num' => $orderNum,
            'create_time' => $order['create_time']
        ];
    }

    //生成订单号
    public static function makeOrderNum()
    {
        $yCode = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');
        $orderNum = $yCode[intval(date('Y') - 2017)] . strtoupper(dechex(date('m')))
            . date('d') . substr(time(), -5) . substr(microtime(), 2, 5)
            . sprintf('%02d', rand(0, 99));
        return $orderNum;
    }

    private function generateOrderSnap($orderStatus, $orderInfo)
    {
        $orderSnap = [
            'totalPrice' => 0,
            'totalCount' => 0,
            'snapName' => null,
            'snapImg' => null,
            'snapProducts' => [],
            'message' => ""
        ];
        $orderSnap['totalPrice'] = $orderStatus['totalPrice'];
        $orderSnap['totalCount'] = count($this->dbProducts);
        $orderSnap['snapProducts'] = $orderStatus['productsStatus'];
        $orderSnap['snapName'] = $this->dbProducts[0]['name'];
        $orderSnap['snapImg'] = $this->dbProducts[0]['img_url'];
        $orderSnap['message'] = $orderInfo['message'];
        if ($orderSnap['totalCount'] > 1) {
            $orderSnap['snapName'] .= '等';
        }
        return $orderSnap;
    }

    //根据购买产品获取数据库 Product 相关信息
    private function getProductsByOrder($oProducts)
    {
        $oProductsId = [];
        foreach ($oProducts as $i => $oProduct) {
            $oProductsId[$i] = $oProduct['product_id'];
        }

        $products = (new ProductModel())->getByIds($oProductsId);
        return $products;
    }

    private function getOrderStatus()
    {
        $orderStatus = [
            "pass" => true,
            "totalPrice" => 0,
            "productsStatus" => []
        ];


        foreach ($this->oProducts as $oProduct) {
            $requireData = "";
            if ($oProduct['require']) {
                $requireData = $oProduct['require'];
            }
            $productStatus = $this->getProductStatus($oProduct['product_id'], $oProduct['qty'], $requireData);

            if (!$productStatus['haveStock']) {
                $orderStatus['pass'] = false;
            }
            $orderStatus['totalPrice'] += $productStatus['totalPrice'];
            array_push($orderStatus['productsStatus'], $productStatus);
        }
        return $orderStatus;
    }

    private function getProductStatus($product_id, $qty, $requireData)
    {
        $product = $this->getDbProductByID($product_id);
        $productStatus = [
            'id' => null,
            'haveStock' => false,
            'qty' => 0,
            'price' => 0,
            'name' => '',
            'totalPrice' => 0,
            'img_url' => null,
            'require' => ''
        ];

        $productStatus['id'] = $product['id'];
        $productStatus['name'] = $product['name'];
        $productStatus['qty'] = $qty;
        $productStatus['price'] = $product['price'];
        $productStatus['img_url'] = $product['img_url'];

        $productStatus['totalPrice'] = $product['price'] * $qty;
        $productStatus['require'] = $requireData;

        if ($product['stock'] - $qty >= 0) {
            $productStatus['haveStock'] = true;
        }
        return $productStatus;

    }

    private function getDbProductByID($product_id)
    {
        $index = -1;
        foreach ($this->dbProducts as $ind => $value) {
            if ($value['id'] == $product_id) {
                $index = $ind;
            }
        }
        if ($index == -1) {
            show_error('产品id:' . $product_id . '商品不存在，创建订单失败');
        }
        return $this->dbProducts[$index];

    }

}