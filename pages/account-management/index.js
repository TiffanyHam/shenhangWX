const app = getApp();
const config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operType: '',
    btnText: '',
    tips: '',
    userName: ''
  },

  onShow() {
    this.setData({
      userName: app.globalData.retInfo.userName
    });

    if (app.globalData.bindingWhat) {
      this.setData({
        btnText: '解除微信绑定',
        operType: 2,
        tips: '已绑定微信号'
      })
    } else {
      this.setData({
        btnText: '绑定微信',
        operType: 1,
        tips: '未绑定微信号'
      })
    }
  },

  bindingWhat() {
    console.log(1111,app.globalData.openId, this.data.operType, app.globalData.userInfo.nickName)
    wx.showLoading();
    wx.request({
      url: config.prefix + 'verify/bind_or_unbind',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: {
        openId: app.globalData.openId,
        operType: this.data.operType,
        nickName: app.globalData.userInfo.nickName
      },
      success: (res) => {
        console.log('account',res)
        wx.hideLoading();
        if (res.data.retCode === 201) {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
          wx.navigateTo({
            url: '/pages/login/index',
          })
          return;
        }
        
        if (res.data.retCode === 203) {
          app.globalData.bindingWhat = true
          this.setData({
            btnText: '解除微信绑定',
            tips: '已绑定微信号',
            operType: 2
          })
        } else if (res.data.retCode === 205) {
          app.globalData.bindingWhat = false
          this.setData({
            btnText: '绑定微信',
            tips: '未绑定微信号',
            operType: 1
          })
        }

        wx.showToast({
          title: res.data.retMsg,
          icon: 'none',
          mask: true
        });
      }
    })
  }
})