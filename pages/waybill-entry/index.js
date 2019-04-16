const app = getApp();
const config = require('../../utils/config.js');
const currentDate = config.formatTime(new Date());

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flightDate: currentDate,
    transDate: currentDate,
    awbPrefix: '479',
    awbNo: '',
    destCode: '',
    // depCode: '',
    startCityIndex: 0,
    startCityName: [],
    cityCodes: null,
    transCity: '',
    flightArray: ['请选择航班号'],
    flightIndex: 0,
    flightNo: '',
    flightcarrierArray: ['请选择航班号'],
    flightcarrierIndex: 0,
    transFlightNo: '',
    remainingSpace: 0, // 剩余舱位
    useCabin: '', // 使用舱位
    goodInfoArry: ['请选择货物代码及品名'],
    goodInfoIndex: 0,
    billCodesArry: ['请选择'],
    billCodes: '',
    billCodesIndex: 0,
    pieces: '', //件数
    weight: '',
    transCarrierCode: '', // 二程航运人
    transCarrierCodeFlag: true,
    carrierCode: '', //  头程航运人
    carrierCodeFlag: true,
    carrierArry: ['请选择', 'ZH', 'CA'],
    carrierArryIndex: 0,
    transCarrierIndex: 0,
    agentCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },

  initData() {
    wx.request({
      url: config.prefix + 'waybillentry/init',
      method: 'GET',
      header: app.globalData.requestHeader,
      success: (res) => {
        if (res.data.retCode === 100) {
          let datas = res.data.retInfo;

          for (let i = 0, len = datas.goodsInfos.length; i < len; i++) {
            this.data.goodInfoArry.push(datas.goodsInfos[i].goodsCode + ' ' + datas.goodsInfos[i].goodsName)
          }

          for (let i = 0, len = datas.billCodes.length; i < len; i++) {
            this.data.billCodesArry.push(datas.billCodes[i].billCode + ' ' + datas.billCodes[i].billName)
          }

          const cityName = [];
          for (let i = 0, len = datas.cityCodes.length; i < len; i++) {
            cityName.push(app.globalData.retInfo.cityInfo[datas.cityCodes[i]])
          }

          this.setData({
            goodInfoArry: this.data.goodInfoArry,
            billCodesArry: this.data.billCodesArry,
            billCodes: datas.billCodes,
            agentCode: datas.agentCode,
            startCityName: cityName,
            cityCodes: datas.cityCodes,
            depCode: datas.cityCodes[0]
          })

          this.billCodesFilter()
          this.requestFight(false, 'start')
        }
      }
    })
  },

  waybillCheck(e) {
    let val = e.detail.value.trim();
    if (!val) {
      return
    }
    this.setData({
      awbNo: val
    })

    this.checkWaybill();
  },

  fixWaybillCheck(e) {
    let val = e.detail.value.trim();
    this.setData({
      awbPrefix: val
    })

    this.checkWaybill();
  },

  // 运价代码更新
  billCodesFilter() {
    let depCode = this.data.depCode;
    let billCodes = this.data.billCodes;
    let newArry = ['请选择'];
    for (let i = 0, len = billCodes[depCode].length; i < len; i++) {
      newArry.push(billCodes[depCode][i].billCode + ' ' + billCodes[depCode][i].billName);
    }

    this.setData({
      billCodesArry: newArry
    })
  },

  checkWaybill() {
    if (!this.data.awbPrefix) {
      wx.showToast({
        title: '请输入运单号前缀',
        icon: 'none'
      })
      return
    }

    if (!this.data.awbNo) {
      wx.showToast({
        title: '请输入运单号',
        icon: 'none'
      })
      return
    }

    wx.request({
      url: config.prefix + 'waybillentry/check',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: {
        awbPrefix: this.data.awbPrefix,
        awbNo: this.data.awbNo
      },
      success: (res) => {
        if (res.data.retCode !== 100) {
          this.setData({
            awbPrefix: '479',
            awbNo: ''
          })
        }

        wx.showToast({
          title: res.data.retMsg,
          icon: 'none',
          mask: true
        });
      }
    })
  },

  startCityChange(e) {
    const index = e.detail.value;
    this.setData({
      startCityIndex: index,
      depCode: this.data.cityCodes[index]
    })
    this.billCodesFilter();
    this.requestFight(false, 'start')

    this.setData({
      flightIndex: 0,
      carrierCode: '',
      carrierArryIndex: 0
    })
  },

  // startCity(e) {
  //   const val = e.detail.value.trim();
  //   if(!val) {
  //     return;
  //   }

  //   if (app.checkCity(val).length){
  //     this.setData({
  //       depCode: app.checkCity(val).join(' ')
  //     });
  //     this.getRemainingSpace()
  //     this.billCodesFilter()
  //     this.requestFight()
  //   } else {
  //     this.setData({
  //       depCode: ''
  //     });

  //     wx.showToast({
  //       title: '城市不存在',
  //       icon: 'none',
  //       mask: true
  //     });
  //   }
  // },

  endCity(e) {
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        destCode: ''
      });
      return;
    }
    if (app.checkCity(val).length) {
      this.setData({
        destCode: app.checkCity(val).join(' ')
      });
      this.getRemainingSpace()

      if (this.data.transCity) {
        this.requestFight(true, 'end')
        this.setData({
          flightcarrierIndex: 0,
          transCarrierCode: '',
          carrierArryIndex: 0
        })
      } else {
        this.requestFight(false, 'end')
        this.setData({
          flightIndex: 0,
          carrierCode: '',
          carrierArryIndex: 0
        })
      }

    } else {
      this.setData({
        destCode: ''
      });

      wx.showToast({
        title: '城市不存在',
        icon: 'none',
        mask: true
      });
    }
  },

  transCityBlur(e) {
    if (!this.data.destCode) {
      wx.showToast({
        title: '请先输入目的站',
        icon: 'none',
        mask: true
      });
      this.setData({
        transCity: ''
      });
      return
    }
    const val = e.detail.value.trim();
    if (!val) {
      this.setData({
        transCity: ''
      });
      return;
    }

    if (app.checkCity(val).length) {
      this.setData({
        transCity: app.checkCity(val).join(' ')
      });
      // 中转城市改变 需要更新头程航班号和二程航班号
      this.requestFight(false, 'trans')
      this.requestFight(true, 'trans')
      this.setData({
        flightIndex: 0,
        carrierCode: '',
        carrierArryIndex: 0,
        flightcarrierIndex: 0,
        transCarrierCode: '',
        carrierArryIndex: 0
      })
    } else {
      this.setData({
        transCity: ''
      });

      wx.showToast({
        title: '城市不存在',
        icon: 'none',
        mask: true
      });
    }
  },

  bindDateChange(e) {
    this.setData({
      flightDate: e.detail.value
    })
    this.getRemainingSpace()
    this.requestFight(false, 'start')
    this.setData({
      flightIndex: 0,
      carrierCode: '',
      carrierArryIndex: 0
    })
  },

  bindtransDateChange(e) {
    this.setData({
      transDate: e.detail.value
    })
    this.requestFight(true, 'trans')
    this.setData({
      flightcarrierIndex: 0,
      transCarrierCode: '',
      carrierArryIndex: 0
    })
  },

  requestFight(transFlag,type) {
    const param = {
      destCode: this.data.destCode && this.data.destCode.split(' ')[0],
      flightDate: this.data.flightDate
    }

    if (type === 'start') { // 始发站改变
      param.depCode = this.data.depCode
      param.flightDate = this.data.flightDate
      if (this.data.transCity) {
        param.destCode = this.data.transCity && this.data.transCity.split(' ')[0]
      } else {
        param.destCode = this.data.destCode && this.data.destCode.split(' ')[0]
      }
    } else if (type === 'trans') { // 中转站改变
      if (transFlag) {
        param.flightDate = this.data.flightDate
        param.depCode = this.data.transCity && this.data.transCity.split(' ')[0]
        param.destCode = this.data.destCode && this.data.destCode.split(' ')[0]
      } else {
        param.flightDate = this.data.transDate
        param.depCode = this.data.depCode
        param.destCode = this.data.transCity && this.data.transCity.split(' ')[0]
      }
    } else if (type === 'end') { // 目的站改变
      param.destCode = this.data.destCode && this.data.destCode.split(' ')[0]
      if (this.data.transCity) {
        param.flightDate = this.data.transDate
        param.depCode = this.data.transCity && this.data.transCity.split(' ')[0]
      } else {
        param.depCode = this.data.depCode
        param.flightDate = this.data.flightDate
      }
    }

    if (param.depCode === param.destCode) {
      wx.showToast({
        title: '始发站和目的站不能相同',
        icon: 'none',
        mask: true
      });
      this.setData({
        flightArray: [],
        flightcarrierArray: []
      })
      return
    }

    wx.request({
      url: config.prefix + 'waybillentry/getflightno',
      method: 'GET',
      header: app.globalData.requestHeader,
      data: param,
      success: (res) => {
        if (res.data.retCode === 100) {
          const flightArry = ['请选择航班号'].concat(res.data.retInfo);
          if (transFlag) {
            this.setData({
              flightcarrierArray: flightArry
            })
          } else {
            this.setData({
              flightArray: flightArry,
            })
          }
        } else {
          if (transFlag) {
            this.setData({
              flightcarrierArray: ['请选择航班号']
            })
          } else {
            this.setData({
              flightArray: ['请选择航班号']
            })
          }
        }
      }
    })
  },

  bindGoodChange(e) {
    this.setData({
      goodInfoIndex: e.detail.value
    })
  },


  bindCodesChange(e) {
    this.setData({
      billCodesIndex: e.detail.value
    })
  },


  bindPickerChange(e) {
    let index = e.detail.value;
    this.setData({
      flightIndex: index,
      flightNo: this.data.flightArray[index]
    })

    let preStr = this.data.flightNo.substr(0, 2);
    if (preStr == 'ZH' || preStr == 'CA') {
      this.setData({
        carrierCode: preStr
      })
    } else {
      this.setData({
        carrierCodeFlag: false
      })
    }

    this.getRemainingSpace()
  },

  bindCarrierChange(e) {
    let index = e.detail.value;
    this.setData({
      carrierArryIndex: index,
      carrierCode: this.data.carrierArry[index]
    })
  },

  bindTransCarrierChange(e) {
    let index = e.detail.value;
    this.setData({
      transCarrierIndex: index,
      transCarrierCode: this.data.carrierArry[index]
    })
  },

  bindPickercarrierChange(e) {
    let index = e.detail.value;
    this.setData({
      flightcarrierIndex: index,
      transFlightNo: this.data.flightcarrierArray[index]
    })

    let preStr = this.data.transFlightNo.substr(0, 2);

    if (preStr == 'ZH' || preStr == 'CA') {
      this.setData({
        transCarrierCode: preStr
      })
    } else {
      this.setData({
        transCarrierCodeFlag: false
      })
    }
  },

  getRemainingSpace() {
    if (this.data.flightDate && this.data.depCode && this.data.destCode && this.data.flightNo) {
      wx.request({
        url: config.prefix + 'waybillentry/getcabin',
        method: 'GET',
        header: app.globalData.requestHeader,
        data: {
          destCode: this.data.destCode && this.data.destCode.split(' ')[0],
          depCode: this.data.depCode,
          flightDate: this.data.flightDate,
          flightNo: this.data.flightNo
        },
        success: (res) => {
          if (res.data.retCode === 100) {
            this.setData({
              remainingSpace: res.data.retInfo
            })

            if (res.data.retInfo - this.data.weight >= 0) {
              this.setData({
                useCabin: '剩余舱位'
              })
            } else {
              this.setData({
                useCabin: '超舱'
              })
            }
          }
        }
      })
    }
  },

  numberPieces(e) {
    let val = e.detail.value;
    if (!/^[0-9]+$/.test(val)) {
      wx.showToast({
        title: '请输入整数',
        icon: 'none'
      })
      this.setData({
        pieces: ''
      })
      return;
    }

    this.setData({
      pieces: val
    })
  },

  weightBlur(e) {
    let val = e.detail.value;
    if (!val) {
      this.setData({
        weight: ''
      })
      return
    }
    if (!/^(([0-9]{1,9})[\.]{0,1}([0-9]{0,1}))$/.test(val)) {
      wx.showToast({
        title: '最多输入9位数加一位小数',
        icon: 'none'
      })
      this.setData({
        weight: ''
      })
      return;
    }

    this.setData({
      weight: val
    })

    if (this.data.remainingSpace - this.data.weight >= 0) {
      this.setData({
        useCabin: '剩余舱位'
      })
    } else {
      this.setData({
        useCabin: '超舱'
      })
    }
  },

  submit() {
    if (!this.data.awbPrefix) {
      wx.showToast({
        title: '请输入运单号前缀',
        icon: 'none'
      })
      return
    }

    if (!this.data.awbNo) {
      wx.showToast({
        title: '请输入运单号',
        icon: 'none'
      })
      return
    }

    if (!this.data.depCode) {
      wx.showToast({
        title: '请输入始发站',
        icon: 'none'
      })
      return
    }

    if (!this.data.destCode) {
      wx.showToast({
        title: '请输入到达站',
        icon: 'none'
      })
      return
    }

    if (!this.data.flightDate) {
      wx.showToast({
        title: '请选择航班日期',
        icon: 'none'
      })
      return
    }

    if (!this.data.flightNo || this.data.flightNo == '请选择航班号') {
      wx.showToast({
        title: '请选择航班号',
        icon: 'none'
      })
      return
    }

    if (!this.data.carrierCode) {
      wx.showToast({
        title: '请选择头程承运人',
        icon: 'none'
      })
      return
    }
debugger
    if (this.data.transCity) {
      if (!this.data.transFlightNo || this.data.transFlightNo == '请选择航班号') {
        wx.showToast({
          title: '请选择二程航班号',
          icon: 'none'
        })
        return
      }

      if (+new Date(this.data.transDate) < +new Date(this.data.flightDate)) {
        wx.showToast({
          title: '二程航班日期必须大于等于头程航班日期',
          icon: 'none'
        })
        return
      }
    }

    let goodsCode = this.data.goodInfoArry[this.data.goodInfoIndex].split(' ')
    if (goodsCode[0] === '请选择货物代码及品名') {
      wx.showToast({
        title: '请选择货物代码和品名',
        icon: 'none'
      })
      return
    }


    if (!this.data.pieces) {
      if (this.data.pieces == 0) {
        wx.showToast({
          title: '件数不应该为0',
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: '请输入件数',
        icon: 'none'
      })
      return
    }

    if (!this.data.weight) {
      if (this.data.weight == 0) {
        wx.showToast({
          title: '重量不应该为0',
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: '请输入重量',
        icon: 'none'
      })
      return
    }

    let billCode = this.data.billCodesArry[this.data.billCodesIndex].split(' ')
    if (billCode[0] === '请选择') {
      wx.showToast({
        title: '请选择运价代码',
        icon: 'none'
      })
      return
    }

    const param = {
      agentCode: this.data.agentCode,
      awbPrefix: this.data.awbPrefix,
      awbNo: this.data.awbNo,
      depCode: this.data.depCode,
      destCode: this.data.destCode.split(' ')[0],
      flightDate: this.data.flightDate,
      flightNo: this.data.flightNo,
      carrierCode: this.data.carrierCode,
      transDate: this.data.transDate,
      transCity: this.data.transCity.split(' ')[0],
      transFlightNo: this.data.transFlightNo,
      transCarrierCode: this.data.transCarrierCode,
      billCode: billCode[0],
      billName: billCode[1],
      goodsCode: goodsCode[0],
      goodsName: goodsCode[1],
      pieces: this.data.pieces,
      weight: this.data.weight
    }
debugger
    wx.request({
      url: config.prefix + 'waybillentry/add',
      method: 'POST',
      header: app.globalData.requestHeader,
      data: param,
      success: (res) => {
        if (res.data.retCode === 100) {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });

          setTimeout(() => {
            // wx.redirectTo({
            //   url: '/pages/index/index',
            // })
            wx.navigateBack();
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          });
        }
      }
    })
  }
})