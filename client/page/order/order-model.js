import { Base } from "../../utils/base.js";
import { Category } from "../../utils/category.js";

var category = new Category();
var config = require('../../config.js');

class Order extends Base {
  constructor() {
    super();
    this._storageName = "newOrder";
    this._orderStatusArr = ["", "待支付", "已完成", "已取消"];
    this._footerStatus = {
      0: "提交订单",
      1: "付款",
    };
    this._payNoStock = 0;
    this._payFail = 1;
    this._paySuccess = 2;
  }

  /**
   * 生成订单
   * products: array 购买的相关产品
   * orderInfo :JSON obj  订单的其它信息
   */
  generateOrder(oProducts, orderInfo, callback) {
    var that = this;
    var params = {
      login: true,
      url: config.service.orderUrl,
      method: "POST",
      data: {
        'products': that.encoderProducts(oProducts),
        'orderInfo': JSON.stringify(orderInfo),
      },
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params);
  }

  encoderProducts(orderProducts) {
    console.log(orderProducts);
    var data = [];
    for (var i = 0; i < orderProducts.length; i++) {
      data.push({
        "product_id": orderProducts[i].id,
        "qty": orderProducts[i].qty,
        "require": JSON.stringify(orderProducts[i].require)
      });
    }
    console.log(data);
    
    return data;
  }

  execPay(orderId, callback) {
    var that = this;
    var params = {
      login: true,
      url: config.service.payUrl,
      method: "POST",
      data: {
        "id": orderId
      },
      sCallback(data) {
        if (data.timeStamp) {
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function (res) {
              callback && callback(that._paySuccess)
            },
            fail: function (error) {
              callback && callback(that._payFail)
            }
          })
        } else {
          callback && callback(that._payNoStock);
        }
      }
    }
    this.request(params);
  }

  getOrderByID(orderID, callback) {
    var params = {
      login: true,
      url: config.service.orderUrl + orderID,
      sCallback(data) {
        callback && callback(data)
      }
    };
    this.request(params)
  }

  getOrders(offset, callback) {
    var params = {
      login: true,
      url: config.service.getOrdersUrl + offset,
      sCallback(data) {
        callback && callback(data.data);
      }
    }
    this.request(params);
  }

  getStringTime(millisecond) {
    var date = new Date(millisecond);
    var year = date.getFullYear().toString()
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    var orderingTime = year + "-" + month + "-" + day +
      " " + hours + ":" + minutes + ":" + seconds;
    return orderingTime;
  }
}

export {
  Order
};