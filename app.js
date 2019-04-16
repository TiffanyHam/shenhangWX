//app.js
const config = require('./utils/config.js');

App({
  onLaunch: function () {
  
    wx.getUserInfo({
      success: (res) => {
        console.log(res.userInfo)
        //用户已经授权过
        this.globalData.userInfo = res.userInfo;
      }
    })
  },

  getCode(fn) {
   wx.login({
      success: res => {
        this.globalData.code = res.code;
        // const APP_ID = 'wxf680e3f9a8824785';//输入小程序appid
        // const APP_SECRET = '1c381fb776b7ef67bab02d10321d6395';//输入小程序app_secret
        // var OPEN_ID = ''//储存获取到openid
        // var SESSION_KEY = ''//储存获取到session_key

        // wx.request({
        //   //获取openid接口
        //   url: 'https://api.weixin.qq.com/sns/jscode2session',
        //   data: {
        //     appid: APP_ID,
        //     secret: APP_SECRET,
        //     js_code: res.code,
        //     grant_type: 'authorization_code'
        //   },
        //   method: 'GET',
        //   success: function (res) {
        //     console.log(res.data)
        //     debugger
        //     // oT0vj5MAlrOi2ombbfEjbv8iuwIs
        //   }
        // })

        fn && fn();
      }
    })
  },

  checkCity(city) {
    city =  city.split(' ')[0]
    const cityInfo = this.globalData.retInfo.cityInfo;
    const cityKeys = Object.keys(cityInfo);
    const cityVal = Object.values(cityInfo);
    const cityCase = city.toLocaleUpperCase();
    
    let cityArry = [];
    if (cityKeys.indexOf(cityCase) >= 0 && cityVal.indexOf(cityCase) < 0) {
      cityArry.push(cityCase)
      cityArry.push(cityVal[cityKeys.indexOf(cityCase)])
    } else if (cityKeys.indexOf(cityCase) < 0 && cityVal.indexOf(cityCase) >= 0) {
      cityArry.push(cityKeys[cityVal.indexOf(cityCase)])
      cityArry.push(cityCase)
    }
    
    if (cityArry.length) {
      return cityArry
    } else {
      return []
    }
  },

  globalData: {
    retInfo: null,
    code:null,
    requestHeader: null,
    userInfo: null,
    bindingWhat: false, // 绑定微信号表示
    openId: ''
  }
})