const app = getApp();
const config = require('../../utils/config.js');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    banners: [
      '/assets/images/banner.jpg',
    ],
    menus: []
  },
  
  onShow() {
    if (!app.globalData.retInfo) {
      wx.redirectTo({
        url: '/pages/preloading/index',
      })
    }
    console.log('retInfo' + app.globalData.retInfo)
    this.setData({
      menus: app.globalData.retInfo.menus
    })
  }
})
