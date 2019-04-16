const app = getApp();
const config = require('../../utils/config.js');
const currentDate = config.formatTime(new Date());

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clearFlag: false,
    flightNo: '',
    date: currentDate,
    loadingMoreHidden: true,
    noDataHidden: true,
    loadingHidden: true,
    flightData: [],
    checkFlag: true,
    destCode: '',
    depCode: '',
    cityStartCheck: true,
    cityEndCheck: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  inputStart(e) {
    const val = e.detail.value.trim();
    if (app.checkCity(val).length) {
      this.setData({
        depCode: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        depCode: '',
        cityStartCheck: true
      });
    }

    this.setData({
      cityStartCheck: !!app.checkCity(val).length
    })
  },

  inputFocusStart() {
    this.setData({
      cityStartCheck: true
    })
  },

  inputEnd(e) {
    const val = e.detail.value.trim();
    if (app.checkCity(val).length) {
      this.setData({
        destCode: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        destCode: '',
        cityEndCheck: true
      });
    }

    this.setData({
      cityEndCheck: !!app.checkCity(val).length
    })
  },

  inputFocusEnd() {
    this.setData({
      cityEndCheck: true
    })
  },

  flightNoInput(e) {
    const val = e.detail.value.trim();
    this.setData({
      flightNo: val.toLocaleUpperCase()
    });
    if (!/^[0-9a-zA-Z]*$/g.test(val)) {
      this.setData({
        checkFlag: false
      })
    }

    if (this.data.flightNo) {
      this.setData({
        clearFlag: true
      })
    } else {
      this.setData({
        clearFlag: false
      })
    }
  },

  inputFocusflight() {
    this.setData({
      checkFlag: true
    })
  },

  clearInput() {
    this.setData({
      flightNo: ''
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  reqestData() {
    wx.showLoading();
    wx.request({
      url: config.prefix + 'flightnumber/query',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: {
        flightNo: this.data.flightNo,
        flightDate: this.data.date,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        depCode: this.data.depCode.split(' ')[0],
        destCode: this.data.destCode.split(' ')[0]
      },
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

          let airData = this.data.flightData.concat(datas);
          // for (let i = 0, len = datas.length; i < len; i++) {
          //   let airArry = airData.filter((item) => {
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

          this.totalPages = res.data.totalNum;
          this.setData({
            flightData: airData,
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true
          });
        } else {
          this.setData({
            flightData: [],
            loadingHidden: true,
            loadingMoreHidden: true,
            noDataHidden: true
          })

          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络异常，请检查网络是否连接',
          icon: 'none',
          mask: true
        });
      }
    })
  },

  search() {
    setTimeout(() => {
      if (!this.data.depCode && !this.data.destCode && !this.data.flightNo) {
        wx.showToast({
          title: '始发站 目的站 航班号至少填一项',
          icon: 'none',
          mask: true
        });
        return;
      }

      // if (!this.data.flightNo) {
      //   wx.showToast({
      //     title: '请输入航班号',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;       
      // }

      if (this.data.flightNo) {
        if (!this.data.checkFlag) {
          wx.showToast({
            title: '请输入正确格式的航班号',
            icon: 'none',
            mask: true
          });
          return;
        }
      }

      this.currentPage = 1;
      this.pageSize = 20;
      this.totalPages = 0;
      this.setData({
        flightData: []
      })
      this.reqestData();
    }, 100)
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