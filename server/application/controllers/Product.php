<?php

defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/2
 * Time: 下午7:04
 */

class Product extends \CI_Controller
{
    public function __construct()
    {

        parent::__construct();
        $this->load->model('ProductModel');
    }

    public function getAll() {
        $productModel = new \ProductModel();
        $result = $productModel->get();
        $this->json($result);
    }

    public function getByCategory($id) {
        $productModel = new ProductModel();
        $result = $productModel->getByCategory($id);
        if (!$result) {
            show_error("请求的商品不存在", 404);
        }
        $this->json($result);
    }
}