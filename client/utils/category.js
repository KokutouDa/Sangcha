 import { Base } from './base.js';

 class Category extends Base {
   constructor() {
     super();
   }

   getCategory(callback) {
     var config = require('../config.js');
     var params = {
       url: config.service.categoryUrl,
       sCallback(data) {
         callback && callback(data)
       }
     }
     this.request(params)
   }

   setStorage(type) {
    wx.setStorageSync(this._storageKeyName, type);
   }

   getStorage() {
     return wx.getStorageSync(this._storageKeyName);
   }
 }

 export { Category };