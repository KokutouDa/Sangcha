<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/16
 * Time: 下午9:44
 */

class BaseController extends CI_Controller
{
    public function checkPositive($value)
    {
        $pattern = "/^[0-9]*[1-9][0-9]*/";
        return (preg_match($pattern, $value) == 1);
    }
}