import {Base} from './base.js'
class Product extends Base {
  
  constructor() {
    super();
  }

  getProductByID(id, callback) {
    var params = {
      "url": "product/" + id,
      "type": "GET",
      sCallback(data) {
        callback&&callback(data);
      }
    };
    this.request(params);
  }
}

export { Product };