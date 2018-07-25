import { Base } from '../../utils/base.js';
import { Cart } from '../cart/cart-model.js';
var qcloud = require('../../vendor/wafer2-client-sdk/index.js');
var cart = new Cart();

class Index extends Base {
  constructor() {
    super();
  }

  getProductsByCategory(id, callback) {
    var config = require('../../config.js')
    var params = {
      url: config.service.categoryUrl + id,
      sCallback(data) {
        var cartProducts = cart.getCartDataFromLocal(false);
        for (var i in data) {
          data[i].require = JSON.parse(data[i].require);
          for (var j in cartProducts) {
            if (data[i].id == cartProducts[j].id) {
              if (!data[i].qty) {
                data[i].qty = cartProducts[j].qty;
              } else {
                data[i].qty += cartProducts[j].qty;
              }
            }
          }
        }
        callback && callback(data);
      }
    }
    this.request(params);
  }

  /**
   * 判断数组中是否含有指定value，返回value所在位置。不存在时返回-1
   * value: {obj}查找值
   * key: {string} 被查找数组下json值对应的key
   * arr: {array}被查找数组
   */
  hasArrayAttr(value, key, arr) {
    var index = -1;
    arr.forEach(function (item, i) {
      if (item[key] == value) {
        index = i;
      }
    });
    return index;
  }
}

export { Index };