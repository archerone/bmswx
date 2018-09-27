//app.js
App({
  onLaunch: function () {  //小程序初始化完成,全局执行一次
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
            }
        })
    })

    updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
            title: '更新提示',
            content: '新版本下载失败',
            showCancel:false
        })
    })

  },
  globalData: {
    userInfo: {
      avatarUrl:null,
      nickName:null
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