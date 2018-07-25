import { Base } from "../../utils/base.js";

class Cart extends Base {

  constructor() {
    super();
    this._storageKey = 'cart';
    this.flatAdd = "add";
    this.flatSubtract = "subtract"
  }
  
  //获取购物车产品数据，flag为true时获取选中的产品
  getCartDataFromLocal(flag) {
    var products = wx.getStorageSync(this._storageKey);
    if (!products) {
      products = [];
    }
    
    if (flag) {
      var selectedProducts = [];
      for (var i in products) {
        if (products[i].selectStatus) {
          selectedProducts.push(products[i])
        }
      }
      products = selectedProducts;
    }
    return products;
  }

  setCartData(products) {
    wx.setStorageSync(this._storageKey, products);
  }

  //添加到购物车
  add(product, qty) {
    var products = this.getCartDataFromLocal();
    var id = product.id;
    var requireData = product.require;
    
    var index = this.hsdIdInCart(products, product.id, requireData);
    if (!index) {
      product.qty = qty;
      product.selectStatus = true;
      console.log(products);
      products.push(product);
    } else {
      if (!(products[index].qty <= 0 && qty < 0)) {
        products[index].qty += qty;

        if (products[index].qty == 0) {
        products.splice(index, 1);
        }
      }
    }
    
    this.setCartData(products);
    return products;
  }

  //如果存在返加index，否则false
  hsdIdInCart(products, id, requireData) {
    for (var i in products) {
      if (id == products[i].id) {
        if (JSON.stringify(requireData) == JSON.stringify(products[i].require)) {
          return i;
        }
      }
    }
    return false;
  }

  deleteById(ids) {
    var cartProducts = this.getCartDataFromLocal();
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    for (let i = 0; i < ids.length; i++) {
      var id = ids[i];
      cartProducts.splice(id, 1)
    }
    this.setCartData(cartProducts);
    return cartProducts;
  }

  itemSelect(index) {
    var products = this.getCartDataFromLocal();
    products[index].selectStatus = !products[index].selectStatus;
    this.setCartData(products);
    return products;
  }

  allSelected(isAllSelected) {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      products[i].selectStatus = !isAllSelected;
    }
    this.setCartData(products);
    return products;
  }

  hasOneSelected() {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      var product = products[i];
      if (product.selectStatus == true) {
        return true;
      }
    }
    return false;
  }

  isAllSelected() {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      var product = products[i];
      if (!product.selectStatus) {
        return false;
      }
    }
    return true;
  }

  //购物车内修改数量
  changeQty(index, type) {
    var products = this.getCartDataFromLocal();
    console.log(index);
    if (type == this.flatAdd) {
      if (products[index].qty < products[index].stock) {
        products[index].qty++;
      }
    } else {
      if (products[index].qty > 1) {
        products[index].qty--;
      }
    }
    this.setCartData(products);
    return products;
  }

  getProductsPrice() {
    var products = this.getCartDataFromLocal();
    var productsPrice = 0;
    for (var i in products) {
      var product = products[i];
      if (product.selectStatus) {
        productsPrice += product.price * 100 * product.qty;
      }
    }
    return productsPrice / 100;
  }

  isEmpty() {
    var products = this.getCartDataFromLocal();
    //todo 如何判断数组是否有值
    if (!products || !products.length > 0) {
      return true
    }
    return false;
  }
}

export { Cart };