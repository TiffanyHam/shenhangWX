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
    approvalFlagArry: [],
    approvalData: [],
    fReply: [],
    cReply: [],
    otherReply: []
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

  expand(e){
    const index = e.currentTarget.dataset.index;
    this.data.approvalFlagArry[index] = !this.data.approvalFlagArry[index];
    this.setData({
      approvalFlagArry: this.data.approvalFlagArry
    })
  },

  fReplyBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.fReply[index] = e.detail.value.trim();
    this.setData({
      fReply: this.data.fReply
    })
  },

  cReplyBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.cReply[index] = e.detail.value.trim();

    this.setData({
      cReply: this.data.cReply
    })
  },

  otherReplyBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.otherReply[index] = e.detail.value.trim();

    this.setData({
      otherReply: this.data.otherReply
    })
  },

  refuse(e) {
    wx.showLoading();
    const index = e.currentTarget.dataset.index;

    const bookingRes = this.data.approvalData[index].batchCabinSelectRes;
    const remainingSpace = [];
    const currentFReply = this.data.fReply[index];
    const currentcReply = this.data.cReply[index];
    const currentotherReply = this.data.otherReply[index];

    bookingRes[0].fReply = currentFReply || 0;
    bookingRes[0].cReply = currentcReply || 0;
    bookingRes[0].otherReply = currentotherReply || 0;
   
    wx.request({
      url: config.prefix + 'cabinreply/refusal',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: {
        cabinRefusalRes: JSON.stringify(bookingRes)
      },
      success: (res) => {
        wx.hideLoading();
        if(res.data.retCode === 100) {
          this.data.approvalFlagArry[index] = false
          this.setData({
            approvalFlagArry: this.data.approvalFlagArry,
            approvalData: []
          })

          this.currentPage = 1;
          this.pageSize = 20;
          this.totalPages = 0;
          this.reqestData();
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        }
      }
    })
  },

  submit(e) {
    wx.showLoading();
    const index = e.currentTarget.dataset.index;

    const bookingRes = this.data.approvalData[index].batchCabinSelectRes;
    const remainingSpace = [];
    const currentFReply = this.data.fReply[index];
    const currentcReply = this.data.cReply[index];
    const currentotherReply = this.data.otherReply[index];

    bookingRes[0].fReply = currentFReply || 0;
    bookingRes[0].cReply = currentcReply || 0;
    bookingRes[0].otherReply = currentotherReply || 0;
    if (bookingRes[1]) {
      bookingRes[1].fReply = currentFReply || 0;
      bookingRes[1].cReply = currentcReply || 0;
      bookingRes[1].otherReply = currentotherReply || 0;
    }

    wx.request({
      url: config.prefix + 'cabinreply/update',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: {
        cabinUpdateRes: JSON.stringify(bookingRes)
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.retCode == 100) {
          this.data.approvalFlagArry[index] = false
          this.setData({
            approvalFlagArry: this.data.approvalFlagArry,
            approvalData: []
          })
          this.currentPage = 1;
          this.pageSize = 20;
          this.totalPages = 0;
          this.reqestData();
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        }
      }
    })
  },

  reqestData() {
    let param = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      ...this.param
    }
    
    wx.request({
      url: config.prefix + 'cabinreply/select',
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
          const approvalData = this.data.approvalData.concat(datas);
          for (let i = 0, len = approvalData.length;i<len;i++) {
            const batchCabinSelectRes = approvalData[i].batchCabinSelectRes[0];
            const total = Number(batchCabinSelectRes.fBooking) + Number(batchCabinSelectRes.cBooking) + Number(batchCabinSelectRes.otherBooking);
            batchCabinSelectRes.totalBooking = total
            if (approvalData[i].batchCabinSelectRes[1]) {
              approvalData[i].batchCabinSelectRes[1].totalBooking = total
            }
            
            this.data.fReply[i] = batchCabinSelectRes.fReply
            this.data.cReply[i] = batchCabinSelectRes.cReply
            this.data.otherReply[i] = batchCabinSelectRes.otherReply
            this.data.approvalFlagArry.push(false);
          }

          this.setData({
            approvalData: approvalData,
            approvalFlagArry: this.data.approvalFlagArry,
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true,
            fReply: this.data.fReply,
            cReply: this.data.cReply,
            otherReply: this.data.otherReply
          });
        } else {
          this.setData({
            approvalData: [],
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