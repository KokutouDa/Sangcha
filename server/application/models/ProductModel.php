<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/2
 * Time: 下午6:58
 */
class ProductModel extends BaseModel
{
    protected $hidden = ['create_time', 'update_time', 'delete_time'];

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function get()
    {
        $query = $this->db->get('product');
        return $this->toArray($query->result_array());
    }

    public function getByCategory($category_id)
    {
        $query = $this->db->get_where('product', array('category_id' => $category_id));
        $result = $this->getAllImgUrlAttrs($query->result_array());
        return $this->toArray($result);
    }

    /**
     * @param $ids array
     * @return array
     */
    public function getByIds($ids) {
        //ids 可以数组里传入数组吗？？
        $query = $this->db->where_in("id", $ids)->get('product');
        $result = $this->getAllImgUrlAttrs($query->result_array());
        return $this->toArray($result);
    }

    /**
     * @param $id int
     * @return array
     */
    public function getById($id) {
        $query = $this->db->get_where('product', array('id' => $id));
        $result = $this->getImgUrlAttr($query->result_array());
        return $this->toArray($result);
    }

    /**
     * add fprefix for imgm_urls
     * @param $result array
     * @return mixed array
     */
    private function getAllImgUrlAttrs($result)
    {
        if ($result) {
            if (is_array($result[0])) {
                for ($i = 0; $i < sizeof($result); $i++) {
                    $result[$i] = $this->getImgUrlAttr($result[$i]);
                }
            }
        }
        return $result;
    }

    /**
     * add prefix for img_url
     * @param $result array
     * @return mixed array
     */
    private function getImgUrlAttr($result)
    {
        if ($result) {
            if (array_key_exists('img_url', $result)) {
                $result['img_url'] = $this->config->item("img_prefix") . $result['img_url'];
            };
        }
        return $result;
    }

}