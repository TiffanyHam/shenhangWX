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
    batchlData: []
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      url: config.prefix + 'cabinreply/query',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: param,
      success: (res) => {
        wx.hideLoading();
        if (res.data.retCode == 100) {
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
          this.setData({
            batchlData: this.data.batchlData.concat(datas),
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true
          });
        } else {
          this.setData({
            batchlData: [],
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
      fail: function () {
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
  onReachBottom: function () {
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