const app = getApp();
const config = require('../../utils/config.js');
const currentDate = config.formatTime(new Date());

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: currentDate,
    endDate: currentDate,
    // startText: '开始日期',
    // endText: '结束日期',
    destCode: '',
    depCode: '',
    flightNo: '',
    checkFlag: true,
    cityStartCheck: true,
    cityEndCheck: true
  },

  onShow() {
    this.start = currentDate;
    this.end = currentDate;
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
    } else {
      this.setData({
        checkFlag: true
      })
    }
  },

  inputFocusflight() {
    this.setData({
      checkFlag: true
    })
  },

  bindstartDateChange(e) {
    this.start = e.detail.value;
    this.setData({
      startDate: e.detail.value
    })
  },

  bindendDateChange(e) {
    this.end = e.detail.value;
    this.setData({
      endDate: e.detail.value
    })
  },

  countDays() {
    let startTime = +new Date(this.start);
    let endTime = +new Date(this.end);
    let countTime = endTime - startTime;
    this.moreDays = false;

    if (countTime < 0) {
      return false;
    }

    if (countTime > 15 * 1000 * 24 * 60 * 60) {
      this.moreDays = true;
      return false;
    }

    let days = Math.floor(countTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((countTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return true;
  },

  aircraftSearch() {
    // if(!this.data.depCode) {
    //   wx.showToast({
    //     title: '请输入始发站',
    //     icon: 'none',
    //     mask: true
    //   });
    //   return;
    // }

    setTimeout(() => {

      // if (!this.data.cityStartCheck) {
      //   wx.showToast({
      //     title: '请输入正确的始发站,如深圳或SZX',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;
      // }

      // if (!this.data.destCode) {
      //   wx.showToast({
      //     title: '请输入目的站',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;
      // }

      // if (!this.data.cityEndCheck) {
      //   wx.showToast({
      //     title: '请输入正确的目的站,如深圳或SZX',
      //     icon: 'none',
      //     mask: true
      //   });
      //   return;
      // }

      if (!this.data.startDate) {
        wx.showToast({
          title: '请选择开始日期',
          icon: 'none',
          mask: true
        });
        return;
      }

      if (!this.data.endDate) {
        wx.showToast({
          title: '请选择结束日期',
          icon: 'none',
          mask: true
        });
        return;
      }

      let flag = this.countDays();
      if (!flag) {
        if (this.moreDays) {
          wx.showToast({
            title: '时间间隔最大不能选择超过15天',
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: '开始时间应该小于结束时间',
            icon: 'none',
            mask: true
          });
        }

        return;
      }

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

      wx.navigateTo({
        url: '/pages/aircraft-inquiry-list/index?depCode=' + this.data.depCode.split(' ')[0] + '&destCode=' + this.data.destCode.split(' ')[0] + '&flightNo=' + this.data.flightNo + '&beginDate=' + this.data.startDate + '&endDate=' + this.data.endDate
      })

    }, 100)
  }
})