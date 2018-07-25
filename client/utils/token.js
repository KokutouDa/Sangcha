var qcloud = require('../vendor/wafer2-client-sdk/index');

class Token {
  constructor() {
    this.baseUrl = Config.restUrl;
    this.verifyUrl = this.baseUrl + "token/user";
  }

  verify() {
    var that = this;
    qcloud.request({
      url: this.verifyUrl,
      success(res) {
        console.log("verifyFromServer");
        console.log(res);
        if (res.data.loginState != 1) {
          that.getTokenFromServer();
        }
      },

      fail(error) {
        console.log('request fail', error)
      }
    })
  }

  getTokenFromServer(callback) {
    qcloud.login({
      success: function(res) {
        console.log("getTokenFromServer");
        console.log(res);
        callback && callback();
      },
      fail: function(err) {
        console.log(err);
      }
    })
    
    
    // var that = this;
    // wx.login({
    //   success: function (res) {
    //     var code = res.code;
    //     if (code) {
    //       wx.request({
    //         url: that.baseUrl + 'user/token',
    //         method: 'POST',
    //         data: {
    //           "code": code
    //         },
    //         success: function (res) {
    //           wx.setStorageSync("token", res.data.token);
    //           callback&&callback();
    //         }
    //       })
    //     }
    //   }
    // })
  }
};

export {Token};