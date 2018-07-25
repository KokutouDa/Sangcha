import {
  Index
} from 'index-model.js'
import {
  Cart
} from '../cart/cart-model.js';
import {
  Category
} from '../../utils/category.js';
import {
  Order
} from '../order/order-model.js';

var index = new Index();
var cart = new Cart();
var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "productsPrice": 0,
    "emptyCart": true,
    "isRequire": false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },

  onShow: function(options) {
    if (this.data.cartProducts) {
      var cartProducts = cart.getCartDataFromLocal(false);
      this.initData(this.data.category, cartProducts);
    }
  },

  _loadData: function() {
    var that = this;
    category.getCategory((data) => {
      var cartProducts = cart.getCartDataFromLocal(false);
      that.initData(data, cartProducts);

      var currentID = this.data.category[0].id;
      that.setData({
        "currentID": currentID,
      });

      index.getProductsByCategory(currentID, (data) => {
        that.setData({
          "products": data
        })
      })
    })
  },

  onCategoryTap: function(event) {
    var id = index.getDataSet(event, 'id');
    if (id != this.data.currentID) {
      this.setData({
        "currentID": id
      });
      index.getProductsByCategory(id, (data) => {
        this.setData({
          "products": data
        })
      });
    }
  },

  onChangeQtyTap: function(event) {
    var productsIndex = index.getDataSet(event, 'index');
    var product = this.data.products[productsIndex];
    var userRequire = product.require;
    var keys = [];
    for (var key in userRequire) {
      keys.push(key);
    }
    var values = index.jsonToArray(userRequire);


    var currentRequire = [];
    for (var i in values) {
      currentRequire[i] = values[i][0];
    }

    this.setData({
      "keys": keys,
      "values": values,
      "currentIndex": productsIndex,
      "currentProduct": product,
      "currentRequire": currentRequire,
      "isRequire": true,
    })


  },

  onRequireTap: function(event) {
    var keysInd = index.getDataSet(event, 'ind');
    var value = index.getDataSet(event, 'value');
    this.data.currentRequire[keysInd] = value;
    this.setData({
      "currentRequire": this.data.currentRequire,
    });
  },

  onAddTap: function(event) {
    var num = 1;
    var product = this.data.currentProduct;
    var requireData = index.generateJson(this.data.keys,
      this.data.currentRequire);
    product.require = requireData;


    var cartProducts = cart.add(product, 1);
    var products = this.data.products;
    var currentIndex = this.data.currentIndex;
    if (!products[currentIndex].qty) {
      products[currentIndex].qty = 1;
    } else {
      products[currentIndex].qty += 1;
    }
    var category = this.setCategoryNum(this.data.currentID,
      this.data.category, num);
    var cartNum = this.data.cartNum + num;

    this.setData({
      "cartProducts": cartProducts,
      "category": category,
      "products": this.data.products,
      "productsPrice": cart.getProductsPrice(),
      "cartNum": cartNum,
      "isRequire": false,
      "emptyCart": cart.isEmpty()
    })
  },

  onCloseTap: function(event) {
    this.setData({
      "isRequire": false
    });
  },

  onCartTap: function(event) {
    if (!this.data.emptyCart) {
      wx.navigateTo({
        url: '../cart/cart',
      })
    }
  },

  onOrderingTap: function(event) {
    var productsPrice = this.data.productsPrice;
    if (productsPrice > 0) {
      wx.navigateTo({
        url: "../order/order?productsPrice=" + productsPrice + "&from=cart",
      })
    }
  },

  onOrderListTap: function(event) {
    wx.navigateTo({
      url: '../ucenter/order-list/order-list',
    })
  },

  //初始化分类和购物车显示的数量
  initData: function(categoryData, cartProducts) {
    categoryData = this.setAllCategoryNum(categoryData, cartProducts);
    var cartNum = this.getCartNum(categoryData);
    var products = this.data.products;
    if (products) {
      for (var i in products) {
        products[i].qty = 0;
        for (var j in cartProducts) {
          if (products[i].id == cartProducts[j].id) {
            if (!products[i].qty) {
              products[i].qty = cartProducts[j].qty;
            } else {
              products[i].qty += cartProducts[j].qty;
            }
          }
        }
      }
      this.setData({
        "products": products,        
      });
    }
    

    this.setData({
      "cartProducts": cartProducts,
      "category": categoryData,
      "cartNum": cartNum,
      "productsPrice": cart.getProductsPrice(),
      "emptyCart": cart.isEmpty(),
    })
  },

  /**
   * 1.遍历 cartProducts
   * 2.每个product 的categoryID，查找category所在的index 加上 product.qty
   */
  setAllCategoryNum: function(category, cartProducts) {
    for (var i in category) {
      category[i].qty = 0;
    }
    for (var i in cartProducts) {
      var categoryID = cartProducts[i].category_id;
      category = this.setCategoryNum(categoryID, category, cartProducts[i].qty);
    }
    return category;
  },

  /**
   * num: int 添加的数量
   **/
  setCategoryNum: function(categoryID, category, num) {

    var categoryIndex = index.hasArrayAttr(categoryID,
      'id', category);
    if (index != -1) {
      if (!category[categoryIndex].qty) {
        category[categoryIndex].qty = num;
      } else {
        category[categoryIndex].qty += num;
      }
    }
    return category;
  },

  //购物车上显示的数量
  getCartNum: function(categoryData) {
    var num = 0;
    for (var i in categoryData) {
      if (categoryData[i].qty) {
        num += categoryData[i].qty;
      }
    }
    return num;
  },
});