const app = getApp();
const config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    app.getCode(() => {
      wx.showLoading();
      wx.request({
        url: config.prefix + 'verify/wechat_login',
        method: 'GET',
        data: {
          wechatCode: app.globalData.code
        },
        header: {
          "content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          wx.hideLoading();
          app.globalData.requestHeader = {
            "content-Type": "application/x-www-form-urlencoded"
          };

          // let retInfo = wx.getStorageSync('retInfo')
          
          // if (retInfo) {
          //   app.globalData.retInfo = retInfo;
          //   app.globalData.bindingWhat = true;
          //   app.globalData.requestHeader = {
          //     "content-Type": "application/x-www-form-urlencoded",
          //     "cookie": retInfo.token
          //   };
          //   app.globalData.openId = retInfo.openId;
          //   wx.redirectTo({
          //     url: '/pages/index/index'
          //   });
          //   return
          // }

          if (res.data.retCode == 200) {
            app.globalData.retInfo = res.data.retInfo; // 绑定成功的话 用户信息
            app.globalData.bindingWhat = true;
            app.globalData.requestHeader = {
              "content-Type": "application/x-www-form-urlencoded",
              "cookie": res.data.retInfo.token
            };
            console.log('preloading 绑定')
            app.globalData.openId = res.data.retInfo.openId; // 没有绑定微信 则返回微信用户openId
            wx.redirectTo({
              url: '/pages/index/index'
            });
          } else if (res.data.retCode == 202) {
            console.log('preloading 未绑定')
            app.globalData.openId = res.data.retInfo.openId; // 没有绑定微信 则返回微信用户openId
            wx.redirectTo({
              url: '/pages/login/index'
            });
          } else {
            console.log('error')
            wx.showToast({
              title: res.data.retMsg,
              icon: 'none',
              mask: true
            });
          };
        },
        fail: function () {
          wx.showToast({
            title: '网络异常，请检查网络是否连接',
            icon: 'none',
            mask: true
          });
        }
      })
    })
  }
})