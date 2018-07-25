import { Cart } from "./cart-model.js";
import { Order } from "../order/order-model.js"
var cart = new Cart();
var order = new Order();

Page({

  data: {
    cartProducts: {},
    isAllSelected: false,
    hasOneSelected: true,
    productsPrice: 0,
  },

  onLoad: function (options) {
    
  },

  onShow: function (options) {
    var cartProducts = cart.getCartDataFromLocal();
    this._resetData(cartProducts);
  },

  onHide: function (options) {
    cart.setCartData(this.data.cartProducts);
  },

  onShoppingTap: function () {
    wx.switchTab({
      url: '/page/index/index',
    });
  },

  onProductTap: function (event) {
    var id = cart.getDataSet(event, "id");
    //todo
  },

  onDeleteTap: function (event) {
    var index = cart.getDataSet(event, "index");
    var cartProducts = cart.deleteById(index);
    console.log(cartProducts);
    this._resetData(cartProducts);
  },

  onChangeQtyTap: function(event) {
    var index = cart.getDataSet(event, "index");
    var type = cart.getDataSet(event, "type");
    var cartProducts = cart.changeQty(index, type);
    this.setData({
      "cartProducts": cartProducts,
      "productsPrice": cart.getProductsPrice(),
    });

  },

  onItemSelectTap: function (event) {
    var index = cart.getDataSet(event, "index");
    var cartProducts = cart.itemSelect(index);
    this._resetData(cartProducts);
  },

  onAllSelectTap: function (event) {
    var cartProducts = cart.allSelected(this.data.isAllSelected);
    this._resetData(cartProducts);
  },

  onOrderingTap: function(event) {
    if (this.data.hasOneSelected) {
      wx.navigateTo({
        url: "../order/order?productsPrice=" + this.data.productsPrice + "&from=cart",
      })
    }
  },

  _resetData: function(cartProducts) {
    this.setData({
      "cartProducts": cartProducts,
      "isAllSelected": cart.isAllSelected(cartProducts),
      "hasOneSelected": cart.hasOneSelected(cartProducts),
      "productsPrice": cart.getProductsPrice(cartProducts)
    })
  },
});