const app = getApp();
const config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingMoreHidden: true,
    noDataHidden: true,
    loadingHidden: true,
    aircraftData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
//     wx.showToast({
//       title: options.depCode,
//       icon: 'none',
//       mask: true
//     });
// return
    this.param = options;
    this.currentPage = 1;
    this.pageSize = 20;
    this.totalPages = 0;
    wx.showLoading();
    this.reqestData();
  },

  reqestData() {
    let param = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      ...this.param
    }

    wx.request({
      url: config.prefix + 'flight/no/query',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: param,
      success: (res) => {
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
        
        if (res.data.retCode === 100) {
          let datas = res.data.retInfo;
  
          if (!datas.length) {
            this.setData({
              loadingHidden: true,
              loadingMoreHidden: true,
              noDataHidden: false
            });
            return;
          }

          this.totalPages = res.data.totalNum;
          // let airData = [];
          // for (let i = 0, len = datas.length; i < len; i++) {
          //  let airArry = airData.filter((item) => {
          //     return item.some((v) => {
          //       return v.depCode === datas[i].depCode && v.destCode === datas[i].destCode;
          //     })
          //   })

          //   if (!airArry.length) {
          //     airData.push(datas.filter((item) => {
          //       return item.depCode === datas[i].depCode && item.destCode === datas[i].destCode;
          //     }))
          //   }
          // }

          const aircraftData = this.data.aircraftData.concat(datas);
          this.setData({
            aircraftData: aircraftData,
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true
          });
        } else {
          this.setData({
            aircraftData: [],
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: false
          });
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        }
      },
      fail: function() {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.currentPage && (this.currentPage * 20 >= this.totalPages) && this.totalPages != 0) {
      this.setData({
        loadingMoreHidden: false,
        noDataHidden: true
      })
      return;
    }

    this.setData({
      loadingHidden: false
    });
    this.currentPage++;
    this.reqestData();
  }
})