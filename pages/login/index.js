const app = getApp();
const config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: false,
    // username: 'TEST',
    // password: '12345678'
    // username: 'H00078',
    // password: 'H00078123',
    // username: 'H03561',
    // password: 'H03561123',
    username: 'LYT2',
    password: '11111111'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  inputUsername: function(e) {
    var username = e.detail.value.trim();
    this.setData({
      username: username
    });
  },

  inputPassword: function(e) {
    var password = e.detail.value.trim();
    this.setData({
      password: password
    });
  },

  checkAll(val) {
    this.openIdFlag = val.detail.checked;
  },

  onGotUserInfo(e) {
    app.globalData.userInfo = JSON.parse(e.detail.rawData);
    this.submit();
  },

  submit(e) {
    if (this.data.disable) {
      return false;
    }

    if (!this.data.username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return false;
    }

    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return false;
    }

    const param = {
      userName: this.data.username,
      pwd: this.data.password
    }

    if (this.openIdFlag) {
      param.openId = app.globalData.openId
    }

    param.nickName = app.globalData.userInfo.nickName;
    wx.showLoading();
    wx.request({
      url: config.prefix + 'verify/login',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: param,
      success: (res) => {
        wx.hideLoading();
        if (res.data.retCode == 200) { // 登录成功
          // wx.setStorage({
          //   key: 'retInfo',
          //   data: res.data.retInfo,
          // })
          
          app.globalData.retInfo = res.data.retInfo; // 绑定成功的话 用户信息
          app.globalData.requestHeader = {
            "content-Type": "application/x-www-form-urlencoded",
            "cookie": res.data.retInfo.token
          };

          // app.globalData.openId = res.data.retInfo.openId;

          if (this.openIdFlag) {
            app.globalData.bindingWhat = true;
          } else {
            app.globalData.bindingWhat = false;
          }

          wx.redirectTo({
            url: '/pages/index/index'
          })
        } else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        };
      },
      fail: () => {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      }
    });
  }
})