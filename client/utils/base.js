var qcloud = require('../vendor/wafer2-client-sdk/index.js');

class Base {

  constructor() {
    
  }

  request(params) {
    var that = this;
    if (!params.method) {
      params.type = 'GET';
    }
    if (!params.login) {
      params.login = false;
    }
    
    qcloud.request({
      login: params.login,
      url: params.url,
      data: params.data,
      method: params.method,
      success: function(res) {
        params.sCallback && params.sCallback(res.data);
      },
      fail: function(res) {
        console.log(res);
      }
    });
  }

  getDataSet(event, key) {
    var data = event.currentTarget.dataset[key];
    return data;
  }

  isEmptyJson(json) {
    for (var i in json) {
      return false;
    }
    return true;
  }

  jsonToArray(json) {
    var jsonArr = [];
    for(var key in json) {
      jsonArr.push(json[key]);
    }
    return jsonArr;
  }

  /**
   * keys: array
   * values: array
   */
  generateJson(keys, values) {
    var result = {};
    for(var i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i];
    }
    return result;
  }
}

export { Base };