<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/5
 * Time: 下午12:04
 */

class BaseModel extends CI_Model
{
    protected $hidden = [];

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * 返回过滤掉属性后的数组
     */
    public function toArray($arr)
    {
        if ($arr || !empty($arr)) {
            $hidden = array_flip($this->hidden);
            if (!empty($this->hidden)) {
                $arr = array_diff_key($arr, $hidden);
                if (is_array($arr[0])) {
                    for ($i = 0; $i < sizeof($arr); $i++) {
                        $arr[$i] = array_diff_key($arr[$i], $hidden);
                    }
                }
            }
        }
        return $arr;
    }
}