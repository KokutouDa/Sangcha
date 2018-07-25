import { Order } from "../../order/order-model.js";

var order = new Order();


Page({
  data: {
    canUse: true,
    currentOffset: 0,
    orders: [],
    orderStatusArr: order._orderStatusArr,
    isLoadedAll: false,   
  },

  onLoad: function(event) {
    var that = this;
    
    wx.getSetting({
      success: function (res) {
        var canUse = true;
        if (!res.authSetting['scope.userInfo'] || res.authSetting['scope.userInfo']==false) {
          canUse = false
        }
        that.setData({
          "canUse" : canUse
        });
      }
    })
    this._getOrders();
    
  },

  onReachBottom: function() {
    if (!this.data.isLoadedAll) {
      this.data.currentOffset = this.data.currentOffset + 10;
      this._getOrders();
    }
  },

  onOrderTap: function(event) {
    var id = order.getDataSet(event, "id");
    wx.navigateTo({
      url: '/page/order/order?orderID=' + id + '&from=order',
    })
  },

  _getOrders: function() {
    order.getOrders(this.data.currentOffset, data => {
      console.log(data);
      if (data.length > 0) {
        var orders = this.data.orders.concat(data);
        this.setData({
          "orders": orders,
        });
      } else {
        this.data.isLoadedAll = true;
      }
    });
  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
        "canUse": true
      });
    }
  },
})