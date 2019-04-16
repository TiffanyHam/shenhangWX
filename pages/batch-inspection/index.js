const app = getApp();
const config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clearFlag: false,
    awbPrefix: '479', // 运单号前缀
    awbNo: '', // 运单号
    awbInfo: {
     
    }
  },

  awbFixInput(e) {
    this.setData({
      awbPrefix: e.detail.value.trim()
    });
  },

  awbInput(e) {
    this.setData({
      awbNo: e.detail.value.trim()
    });

    if(this.data.awbNo) {
      this.setData({
        clearFlag: true
      })
    } else {
      this.setData({
        clearFlag: false
      })
    }
  },

  clearInput() {
    this.setData({
      awbNo: ''
    })
  },

  search() {
    if(!this.data.awbNo) {
      wx.showToast({ title: '请输入运单号', icon: 'none' });
      return;
    }

    wx.showLoading();
    wx.request({
      url: config.prefix + 'waybill/query',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: {
        awbPrefix: this.data.awbPrefix,
        awbNo: this.data.awbNo
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.retCode == 100) {
          let datas = res.data.retInfo;
          datas.depCode = app.checkCity(datas.depCode)[1];
          datas.destCode = app.checkCity(datas.destCode)[1];

          this.setData({
            awbInfo: datas
          })
        } else {
          this.setData({
            awbInfo: {}
          })
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        };
      }
    });
  }
})