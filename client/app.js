import { Token } from "/utils/token.js"
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({

  /**
   * 当小程序初始化完成时
   */
  onLaunch: function () {
    qcloud.setLoginUrl("https://mdid12kt.qcloud.la/token/login");
  },
})
