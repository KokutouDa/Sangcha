<?php
//namespace app\controller;
//defined('BASEPATH') OR exit('No direct script access allowed');

class Dem extends \CI_Controller {
    public function index() {
        $this->json([
            'code' => 0,
            'data' => [
                'msg' => 'Hello World'
            ]
        ]);
    }
}