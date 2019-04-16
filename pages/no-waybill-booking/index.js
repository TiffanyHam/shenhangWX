const app = getApp();
const config = require('../../utils/config.js');
const currentDate = config.formatTime(new Date());

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: currentDate,
    destCode: '', // 始发站
    depCode: '', // 目的站
    flightNo: '', // 头程航班号
    transCity: '', // 中转城市
    transFlightNo: '',
    cityStartCheck: true,
    cityEndCheck: true,
    transCityCheck: true,
    checkFlag: true,
    transFlightCheckFlag: true,
    initdepCityName: [],
    initDepCode: [],
    initdepIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.request({
      url: config.prefix + 'bookingspace/init',
      method: 'GET',
      header: app.globalData.requestHeader,
      success: res => {
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
          const cityName = [];
          const datas = res.data.retInfo;
          for (let i = 0, len = datas.length; i < len; i++) {
            cityName.push(app.globalData.retInfo.cityInfo[datas[i]])
          }

          this.setData({
            initDepCode: datas,
            initdepCityName: cityName,
            depCode: datas[0]
          })
        }
      }
    })
  },

  inputStart(e) {
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        depCode: '',
        cityStartCheck: true
      });
      return
    }
    if (app.checkCity(val).length) {
      this.setData({
        depCode: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        depCode: ''
      });
    }

    this.setData({
      cityStartCheck: !!app.checkCity(val).length
    })
  },


  startCityChange(e) {
    const index = e.detail.value;
    this.setData({
      initdepIndex: index,
      depCode: this.data.initDepCode[index]
    })
  },

  inputFocusStart() {
    this.setData({
      cityStartCheck: true
    })
  },

  inputEnd(e) {
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        destCode: '',
        cityEndCheck: true
      });
      return
    }
    if (app.checkCity(val).length) {
      this.setData({
        destCode: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        destCode: ''
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

  inputFlightNo(e) {
    const val = e.detail.value.trim();
    this.setData({
      flightNo: val.toLocaleUpperCase()
    });

    if (!/^[0-9a-zA-Z]*$/g.test(val)) {
      this.setData({
        checkFlag: false
      })
    }
  },

  inputFocusflight() {
    this.setData({
      checkFlag: true
    })
  },

  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  transFlightNoInput(e) {
    const val = e.detail.value.trim();
    this.setData({
      transFlightNo: val.toLocaleUpperCase()
    });

    if (!/^[0-9a-zA-Z]*$/g.test(val)) {
      this.setData({
        transFlightCheckFlag: false
      })
    }
  },

  inputFocusTransFlightNo() {
    this.setData({
      transFlightCheckFlag: true
    })
  },

  inputTransCity(e) {
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        transCity: '',
        transCityCheck: true
      });
      return
    }
    if (app.checkCity(val).length) {
      this.setData({
        transCity: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        transCity: ''
      });
    }

    this.setData({
      transCityCheck: !!app.checkCity(val).length
    })
  },

  inputFocusTransCity() {
    this.setData({
      transCityCheck: true
    })
  },

  waybillSearch(e) {
    setTimeout(() => {
      if (!this.data.depCode) {
        wx.showToast({
          title: '请输入始发站',
          icon: 'none',
          mask: true
        });
        return;
      }

      if (!this.data.destCode) {
        wx.showToast({
          title: '请输入目的站',
          icon: 'none',
          mask: true
        });
        return;
      }

      // if (!this.data.cityEndCheck) {
      //   wx.showToast({
      //     title: '请输入正确的目的站,如深圳或SZX',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;
      // }

      // if (!this.data.cityStartCheck) {
      //   wx.showToast({
      //     title: '请输入正确的始发站,如深圳或SZX',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;
      // }


      // if (this.data.transCity) {
      //   if (!this.data.transCityCheck) {
      //     wx.showToast({
      //       title: '请输入正确的中转城市,如深圳或SZX',
      //       icon: 'none',
      //       mask: true
      //     });
      //     return;
      //   }
      // }


      if (!this.data.checkFlag) {
        wx.showToast({
          title: '请输入正确的头程航班号',
          icon: 'none',
          mask: true
        });
        return;
      }

      if (!this.data.transFlightCheckFlag) {
        wx.showToast({
          title: '请输入正确的二程航班号',
          icon: 'none',
          mask: true
        });
        return;
      }

      if (!this.data.date) {
        wx.showToast({
          title: '请选择开始日期',
          icon: 'none',
          mask: true
        });
        return;
      }

      let depCode = ''
      if (this.data.depCode.split(' ').length > 1) {
        depCode = this.data.depCode.split(' ')[0]
      } else {
        depCode = this.data.depCode
      }

      wx.navigateTo({
        url: '/pages/no-waybill-list/index?depCode=' + this.data.depCode.split(' ')[0] + '&destCode=' + this.data.destCode.split(' ')[0] + '&flightNo=' + this.data.flightNo + '&flightDate=' + this.data.date + '&transCity=' + this.data.transCity.split(' ')[0] + '&transFlightNo=' + this.data.transFlightNo
      })
    }, 100)
  }
})