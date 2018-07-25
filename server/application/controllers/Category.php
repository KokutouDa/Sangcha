<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/4
 * Time: 下午4:44
 */

class Category extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('CategoryModel');
    }

    public function get()
    {
        $result = (new CategoryModel())->get();
        if (!$result) {
            show_error("请求的类目不存在", 404);
        }
        $this->json($result);

    }

}