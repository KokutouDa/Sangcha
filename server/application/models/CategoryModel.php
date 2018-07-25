<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/4
 * Time: 下午4:45
 */

class CategoryModel extends BaseModel
{
    protected $hidden = ['create_time', 'delete_time'];

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get()
    {
        $query = $this->db->order_by('sort', 'DESC')->get('category');
        $resultArr = $query->result_array();
        if ($resultArr) {
            $this->toArray($resultArr);
        }
        return $resultArr;
    }

}