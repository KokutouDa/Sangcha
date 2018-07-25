<?php
/**
 * Created by PhpStorm.
 * User: mac
 * Date: 2018/7/13
 * Time: 下午9:21
 */

class OrderModel extends BaseModel
{
    private $dbName = "order";
    protected $hidden = ['create_time', 'delete_time', 'update_time', 'open_id'];

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function insertData($data)
    {
        if (!array_key_exists('create_time', $data)) {
            $data['create_time'] = time();
        }
        if (!array_key_exists('update_time', $data)) {
            $data['update_time'] = time();
        }
        return $this->db->insert("order", $data);
    }

    /**
     * @param $orderNum int
     * @return mixed object
     */
    public function getByOrderNum($orderNum)
    {
        $query = $this->db->get_where($this->dbName, array("order_num" => $orderNum));
        $result = $query->row_array();
        return $result;
    }

    public function getByID($id)
    {
        $query = $this->db->get_where($this->dbName, array("id" => $id));
        $result = $query->row_array();
        return $result;
    }

    public function getOrders($openid, $offset)
    {
        $query = $this->db
            ->order_by('id', 'DESC')
            ->limit(10, $offset)
            ->get_where($this->dbName, array("open_id" => $openid));
        $result = $query->result_array();
        return $this->toArray($result);

    }

    public function updateById($id, $data)
    {
        $this->db->where('id', $id);
        $this->db->update("order", $data);
    }

}