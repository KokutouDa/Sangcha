/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'xxx';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/token/login`,
        //checkLogin
        userUrl: `${host}/token/user`,
        
        //生成订单
        orderUrl: `${host}/order/`,
        //获取用户订单
        getOrdersUrl: `${host}/order/by_user/`,

        //支付
        payUrl: `${host}/pay/pre_order`,

        productUrl: `${host}/product`,
        categoryUrl: `${host}/category/`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnelUrl: `${host}/weapp/tunnel`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;