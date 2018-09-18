//app.js
App({
  onLaunch: function () {  //小程序初始化完成,全局执行一次
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: {
      avatarUrl:null,
      nickName:null,
      isauth:false,
      islogin:false
    }
  },
  //从后台进入前台
  onShow: function(opts){

  },
  //从前台进入后台
  onHide: function(opts){
    console.log('hide');
  },
  //脚本错误或者api调用错误
  onError: function(msg){

  }
})