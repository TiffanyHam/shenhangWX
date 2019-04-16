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
    waybillData: [],
    expandFlagArry: [],
    fBooking: [],
    cBooking: [],
    otherBooking: [],
    submitBtn: false
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

  expand(e) {
    const index = e.currentTarget.dataset.index;
    this.data.expandFlagArry[index] = !this.data.expandFlagArry[index];
    this.setData({
      expandFlagArry: this.data.expandFlagArry
    })
  },

  fBookingBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.fBooking[index] = e.detail.value.trim();
    this.setData({
      fBooking: this.data.fBooking
    })
  },

  cBookingBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.cBooking[index] = e.detail.value.trim();

    this.setData({
      cBooking: this.data.cBooking
    })
  },

  otherBookingBlur(e) {
    const index = e.currentTarget.dataset.index;
    this.data.otherBooking[index] = e.detail.value.trim();

    this.setData({
      otherBooking: this.data.otherBooking
    })
  },

  submit(e) {
    if(this.data.submitBtn) {
      return
    }
    
    this.setData({
      submitBtn: true
    })
    const index = e.currentTarget.dataset.index;
    const bookingRes = this.data.waybillData[index].bookingSpaceQueryRes;
    const remainingSpace = [];
    const currentFBooking = this.data.fBooking[index];
    const currentcBooking = this.data.cBooking[index];
    const currentotherBooking = this.data.otherBooking[index];

    const totalBooking = Number(currentFBooking) || 0 + Number(currentcBooking) || 0 + Number(currentotherBooking) || 0
    if (totalBooking == 0) {
      wx.showToast({
        title: '总重量不可为空或0',
        icon: 'none',
        mask: true
      });
      this.setData({
        submitBtn: false
      })
      return
    }

    for (let i = 0, len = bookingRes.length;i<len;i++) {
      remainingSpace.push(Number(bookingRes[i].controlWeight) + Number(bookingRes[i].freeWeight));
      bookingRes[i].cBooking = currentcBooking;
      bookingRes[i].fBooking = currentFBooking;
      bookingRes[i].otherBooking = currentotherBooking;
    }

    let currentRes = Number(currentFBooking) + Number(currentcBooking) + Number(currentotherBooking);
    const filter = remainingSpace.filter(item => {
      return item < currentRes
    })

    if (filter.length > 0) {
      wx.showToast({
        title: '舱位不够',
        icon: 'none',
        mask: true
      });
      this.setData({
        submitBtn: false
      })
      return
    }
    wx.showLoading();
    wx.request({
      url: config.prefix + 'bookingspace/add',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: { bookingRes: JSON.stringify(bookingRes) },
      success: res => {
        wx.hideLoading();
        this.setData({
          submitBtn: false
        })
        if (res.data.retCode === 201) {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
          wx.navigateTo({
            url: '/pages/login/index',
          })
          return
        }

        if (res.data.retCode == 100) {
          this.data.expandFlagArry[index] = !this.data.expandFlagArry[index];
          this.setData({
            expandFlagArry: this.data.expandFlagArry
          })

          this.data.fBooking[index] = '';
          this.data.cBooking[index] = '';
          this.data.otherBooking[index] = '';
          this.setData({
            fBooking: this.data.fBooking,
            cBooking: this.data.cBooking,
            otherBooking: this.data.otherBooking
          })

          this.currentPage = 1;
          this.pageSize = 20;
          this.totalPages = 0;
          this.setData({
            waybillData:[]
          })
          this.reqestData();
        }

        wx.showToast({
          title: res.data.retMsg,
          icon: 'none',
          mask: true
        });
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
      url: config.prefix + 'bookingspace/query',
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
          return
        }

        if (res.data.retCode == 100) {
          let datas = res.data.retInfo;
          if (!datas.length) {
            this.setData({
              waybillData: [],
              loadingHidden: true,
              loadingMoreHidden: true,
              noDataHidden: false
            });
            return;
          }
          let waybillData = this.data.waybillData.concat(datas);
          for (let i = 0, len = waybillData.length;i<len;i++) {
            this.data.expandFlagArry.push(false);
            for (let n = 0, len = waybillData[i].bookingSpaceQueryRes.length;n<len;n++) {
              waybillData[i].bookingSpaceQueryRes[n].remainingSpace = Number(waybillData[i].bookingSpaceQueryRes[n].controlWeight) + Number(waybillData[i].bookingSpaceQueryRes[n].freeWeight)
            }
          }
          this.totalPages = res.data.totalNum;
          this.setData({
            waybillData: waybillData,
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true,
            expandFlagArry: this.data.expandFlagArry
          });
        } else {
          this.setData({
            waybillData: [],
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