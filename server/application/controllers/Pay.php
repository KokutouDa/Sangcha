<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/16
 * Time: 下午9:47
 */

use \QCloud_WeApp_SDK\Auth\LoginService as LoginService;
use QCloud_WeApp_SDK\Constants as Constants;

require_once ('/data/release/php-weapp-demo/application/libraries/service/WxNotify.php');
require_once ('/data/release/php-weapp-demo/application/controllers/BaseController.php');

class Pay extends BaseController
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('OrderModel');
    }

    public function getPreOrder()
    {
        if (!$_POST && $this->input->get_request_header('Content-Type') == "application/json") {
            $data = (array) json_decode($this->input->raw_input_stream, true);
        } else {
            $data = $this->input->post();
        }
        $id = $data['id'];

        if (!$this->checkPositive($id)) {
            show_error('id 必须为正数');
        }
        $result = LoginService::check();
        if ($result['loginState'] === Constants::S_AUTH) {
            $openid = $result['userinfo']['openId'];
            $params = array('id' => $id, 'openid' => $openid);
            $this->load->library("service/payService", $params);
            $this->json($this->payservice->pay());
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }

    public function receiveNotify()
    {
        $notify = new wxNotify();
        $notify->Handle(true);
    }

}