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
    unapproved: true,
    refuse: true,
    approved: true,
    agentCoode: '',
    agentCoodeArry: [],
    agentCoodeIndex: 0,
    destCode: '',
    depCode: '',
    flightNo: '',
    transferCity: '',
    cityStartCheck: true,
    cityEndCheck: true,
    transCityCheck: true,
    checkFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      agentCoodeArry: app.globalData.retInfo.agentCodes,
      agentCoode: app.globalData.retInfo.agentCodes[0]
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


  inputAgentCoode(e) {
    this.setData({
      agentCoode: e.detail.value.trim()
    });
  },

  bindPickerChange(e) {
    let index = e.detail.value;
    this.setData({
      agentCoodeIndex: index,
      agentCoode: this.data.agentCoodeArry[index]
    })
  },

  inputTransCity(e) {
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        transferCity: '',
        transCityCheck: true
      });
      return
    }
    if (app.checkCity(val).length) {
      this.setData({
        transferCity: app.checkCity(val).join(' ')
      });
    } else {
      this.setData({
        transferCity: ''
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

  unapprovedCheckAll(e) {
    this.setData({
      unapproved: e.detail.checked
    })
  },

  refuseCheckAll(e) {
    this.setData({
      refuse: e.detail.checked
    })
  },

  approvedCheckAll(e) {
    this.setData({
      approved: e.detail.checked
    })
  },

  bindstartDateChange(e) {
    this.start = e.detail.value;
    // let flag = this.countDays();
    // if (!flag) {
    //   if (this.moreDays) {
    //     wx.showToast({
    //       title: '时间间隔最大不能选择超过7天',
    //       icon: 'none',
    //       mask: true
    //     });
    //   } else {
    //     wx.showToast({
    //       title: '开始时间应该小于结束时间',
    //       icon: 'none',
    //       mask: true
    //     });
    //   }

    //   return;
    // }


    this.setData({
      startDate: e.detail.value
    })
  },

  bindendDateChange(e) {
    this.end = e.detail.value;
    // let flag = this.countDays();

    // if (!flag) {
    //   if (this.moreDays) {
    //     wx.showToast({
    //       title: '时间间隔最大不能选择超过30天',
    //       icon: 'none',
    //       mask: true
    //     });
    //   } else {
    //     wx.showToast({
    //       title: '开始时间应该小于结束时间',
    //       icon: 'none',
    //       mask: true
    //     });
    //   }

    //   return;
    // }

    this.setData({
      endDate: e.detail.value
    })
  },

  countDays() {
    let startTime = +new Date(this.data.startDate);
    let endTime = +new Date(this.data.endDate);
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

  approvalSearch() {
    setTimeout(() => {
      // if (!this.data.cityStartCheck) {
      //   wx.showToast({
      //     title: '请输入正确的始发站,如深圳或SZX',
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

      // if (this.data.transferCity) {
      //   if (!this.data.transCityCheck) {
      //     wx.showToast({
      //       title: '请输入正确中转城市,如深圳或SZX',
      //       icon: 'none',
      //       mask: true
      //     });
      //     return;
      //   }

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

      let shipStatus = '';
      if (this.data.unapproved) {
        shipStatus += '0';
      }

      if (this.data.approved) {
        shipStatus += '1';
      }

      if (this.data.refuse) {
        shipStatus += '2';
      }

      wx.navigateTo({
        url: '/pages/batch-search-list/index?depCode=' + this.data.depCode.split(' ')[0] + '&destCode=' + this.data.destCode.split(' ')[0] + '&flightNo=' + this.data.flightNo + '&beginDate=' + this.data.startDate + '&endDate=' + this.data.endDate + '&transCity=' + this.data.transferCity.split(' ')[0] + '&agentCode=' + (this.data.agentCoode || '') + '&shipStatus=' + shipStatus
      })
    }, 100)
  }
})