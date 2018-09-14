//app.js
var utils = require('utils/util.js');
App({
  onLaunch: function () {  //小程序初始化完成,全局执行一次
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    // 登录
    var thirdSession = wx.getStorageSync('thirdSession');
    var _this = this;
    utils.showLoading("数据加载中");
    wx.checkSession({
       success:function(){
          if(thirdSession){  //wx的session未过期,还需判断thirdsession是否过期
              utils.request('/api/bmsxcx/taste/login/islogin', {thirdsess: thirdSession}, "POST", 2, function (res) {
                  wx.hideLoading()
                  if(res.data){ //1,已登录
                      console.log('wx.session未过期;thirdSession也未过期,已刷新');
                  }else{//0,未登录
                      //若wx的session未过期,thirdsession过期,那再进行一次登录
                      _this.gologin();
                  }
              },function(res){
                  wx.hideLoading()
                  //utils.showModal('提示', res.errMsg,false);
              });
          }else{
              //若登录状态thirdsession被删
              _this.gologin();
          }
       },
       fail:function(){
          _this.gologin();
       }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //_this.globalData.userInfo = res.userInfo
              console.log('userinfo',res);
              _this.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
              _this.globalData.userInfo.nickName = res.userInfo.nickName;
              _this.globalData.userInfo.isauth = true;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
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

  },
  gologin: function(){
      console.log('wx.login')


      wx.login({
          success: wxres => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if(wxres.code){
                utils.request('/api/bmsxcx/taste/login/getopenid', {code: wxres.code}, "POST", 2, function (res) {
                    wx.hideLoading()
                    console.log('登录微信成功')
                    if(res.statusCode >= 200 && res.statusCode < 300){
                        wx.setStorageSync('thirdSession', res.data);
                    }
                },function(res){
                    wx.hideLoading()
                    //utils.showModal('提示', res.errMsg,false);
                });
            }
          }
      })
  }
})