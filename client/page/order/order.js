import { Order } from './order-model.js';
import { Cart } from '../cart/cart-model.js';
var order = new Order();
var cart = new Cart();

Page({
  data: {
    canUse: true,
    orderProducts: [],
    orderStatus: 0,
    orderStatusArr: order._orderStatusArr,
    footerStatus: order._footerStatus,
  },

  onLoad: function (option) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        var canUse = true;
        if (!res.authSetting['scope.userInfo'] || res.authSetting['scope.userInfo'] == false) {
          canUse = false
        }
        that.setData({
          "canUse": canUse
        });
      }
    })

    if (option.from == "cart") {
      this._fromCart(option.productsPrice);
    }
    else {
      this._fromOrder(option.orderID);
      this.data.orderID = option.orderID
    }
  },

  _fromCart: function (productsPrice) {
    var orderProducts = cart.getCartDataFromLocal(true);
    var productsPrice = parseFloat(productsPrice);

    this.setData({
      'orderProducts': orderProducts,
      'productsPrice': productsPrice,
    });
  },

  _fromOrder: function (orderID) {
    var that = this;
    order.getOrderByID(orderID, (data) => {
      var orderProducts = JSON.parse(data.snap_products);
      for (var i in orderProducts) {
        if (orderProducts[i].require) {
          orderProducts[i].require = JSON.parse(orderProducts[i].require);
        } else {
          orderProducts[i].require = "";
        }
      }
      
      that.setData({
        "orderNum": data.order_num,
        "orderProducts": orderProducts,
        "productsPrice": data.total_price,
        "orderStatus": data.status,
        "orderingTime": order.getStringTime(data.create_time),
        "message": data.message,
      });
    });
  },

  onPayTap: function (event) {
    if (this.data.orderStatus == 0) {
      this.firstPay();
    } else {
      this.oneMorePay();
    }
  },

  firstPay: function () {
    var that = this;
    var orderInfo = {};
    if (!this.data.message) {
      orderInfo['message'] = "";
    } else {
      orderInfo['message'] = this.data.message;
    }

    order.generateOrder(this.data.orderProducts, orderInfo, (data) => {
      console.log(data);
      if (data.pass) {
        var orderID = data.order_id;
        that.execPay(orderID)
      } else {
        that._orderFailed(data);
      }
    });
  },

  oneMorePay: function () {
    order.execPay(this.data.orderID, (statusCode) => {
      console.log(statusCode);
      if (statusCode == order._paySuccess) {
        this.setData({
          "orderStatus": statusCode
        });
      }
    });
  },

  _orderFailed: function (data) {
    var products = data.productsStatus;
    var productsName = "";
    for (let i = 0; i < products.length; i++) {
      if (!products[i].haveStock) {
        productsName += products[i].name;
        if (products.length - 1 != i) {
          productsName += ", ";
        }
      }
    }
    productsName += "缺货"
    wx.showModal({
      title: '下单失败',
      content: productsName,
      showCancel: false,
    });
  },

  execPay: function (orderID) {
    var that = this;
    order.execPay(orderID, (statusCode) => {
      if (statusCode != order._payNoStock) {
        that.deleteCartProducts();
        wx.redirectTo({
          url: '/page/order/order?orderID=' + orderID + '&from=order',
        })
      }
    });
  },

  bindMessage: function (e) {
    var message = e.detail.value;
    this.setData({
      "message": message
    });
  },

  deleteCartProducts: function () {
    var orderProducts = this.data.orderProducts;
    var ids = [];
    for (let i = 0; i < orderProducts.length; i++) {
      ids.push(orderProducts[i].id);
    }
    cart.deleteById(ids)
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        "canUse": true
      });
    }
  },  
});