import cfg from '../common/config/index.js'
let postUrl = cfg.domain;
const app = getApp()
/*ajax请求*/
function request(url, data, method, headertype, successCallback, failCallback, completeCallback) {
  //var sessionId = wx.getStorageSync("sessionId");
  if(headertype == 2){
    var header = {'content-type': 'application/x-www-form-urlencoded'}
  }else{
    var header = {'content-type': 'application/json'}
  }
  //获取网络类型。
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      if (networkType == "none") {
        showModal('提示', '没有网络可用');
      } else {
        wx.request({
          url: postUrl + url, //仅为示例，并非真实的接口地址
          data: data,
          method: method ? method : 'GET',
          header: header,
          success: successCallback,
          fail: failCallback,
          complete: completeCallback
        });
      }
    }
  })
}

/*获取微信用户信息*/
function getuinfo(that,fn) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {  //若拿不到授权信息
          wx.authorize({
            scope: 'scope.userInfo',
            success() {

            },
            fail(){
              console.log('未授权1')
            }
          })
        }
        else {
          console.log('已授权')
          wx.getUserInfo({
            success: (res) => {
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
              if(fn){
                  fn(res);
              }

            }
          })
          //that.UserLogin();
        }
      }
    })
}
/*用微信登录*/
function wxlogin(that){
    wx.showLoading("数据加载中");
    checksess(function(){  //检查sess
          that.setData({
            islogin: true
          })
          //获取授权
          getuinfo(that,function(res){
                app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
                app.globalData.userInfo.nickName = res.userInfo.nickName;
                that.setData({
                  nickName: app.globalData.userInfo.nickName,
                })
                that.getin();
                //login.getminfo(wx.getStorageSync('thirdSession'),res.encryptedData,res.iv,res.signature,res.rawData)
          })
    },function(){
          gologin(function(){ //重新登陆sess
              that.setData({
                islogin: true
              })
              getuinfo(that,function(res){  //获取授权
                    app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
                    app.globalData.userInfo.nickName = res.userInfo.nickName;
                    that.setData({
                      nickName: app.globalData.userInfo.nickName,
                    })
                    that.getin(); //参与活动
                    //login.getminfo(wx.getStorageSync('thirdSession'),res.encryptedData,res.iv,res.signature,res.rawData)
              })
          });
    })
}
/*参与活动*/
function getin(username,avar,fn){
      var that = this;
      request('/api/bmsxcx/taste/login/checkuser',
          {
            thirdsess: wx.getStorageSync('thirdSession'),
            username: username,
            avatarurl: avar
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          if(fn){
             fn(res)
          }
      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
}
//仅判断客户端和微信端sess是否过期,页面见切换时用到
function checkwxse(fn1,fn2){
   wx.checkSession({
       success:function(){
          wx.hideLoading()
          if(fn1){
            fn1();
          }
       },
       fail:function(){
          wx.hideLoading()
          if(fn2){
            fn2();
          }
       }
    });
}
/*微信第三方后台会话状态判断,登录时用到*/
function checksess(fn1,fn2){
    var thirdSession = wx.getStorageSync('thirdSession');
    wx.checkSession({
       success:function(){
          if(thirdSession){  //wx的session未过期,还需判断thirdsession是否过期
              request('/api/bmsxcx/taste/login/islogin', {thirdsess: thirdSession}, "POST", 2, function (res) {
                  wx.hideLoading()
                  console.log('?????',res.data==1);
                  if(res.data==1){ //1,已登录
                      console.log('wx.session未过期;thirdSession也未过期,已刷新');
                      if(fn1){
                        fn1();
                      }
                  }else{//0,未登录
                      //若wx的session未过期,thirdsession过期,那再进行一次登录
                      wx.hideLoading()
                      wx.removeStorageSync('thirdSession')
                      if(fn2){
                        fn2();
                      }
                  }
              },function(res){
                  wx.removeStorageSync('thirdSession')
                  wx.hideLoading()
                  //utils.showModal('提示', res.errMsg,false);
              });
          }else{
              //若登录状态thirdsession被删
              wx.removeStorageSync('thirdSession')
              wx.hideLoading()
              if(fn2){
                fn2();
              }
          }
       },
       fail:function(){
          wx.removeStorageSync('thirdSession')
          wx.hideLoading()
          if(fn2){
            fn2();
          }
       }
    });
}

/*登录第三方后台获取thirdsess*/
function gologin(fn){
    wx.login({
          success: wxres => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if(wxres.code){
                request('/api/bmsxcx/taste/login/getopenid', {code: wxres.code}, "POST", 2, function (res) {
                    wx.hideLoading()
                    console.log('登录微信成功')
                    if(res.statusCode >= 200 && res.statusCode < 300){
                        wx.setStorageSync('thirdSession', res.data);
                        if(fn){
                          fn();
                        }
                    }
                },function(res){
                    wx.hideLoading()
                    //utils.showModal('提示', res.errMsg,false);
                });
            }
          }
    })
}

/*获取用户敏感信息*/
function getminfo(sess,encry,iv,signature,rawData){  //获取敏感信息unionid,前提是在一个开放平台下的应用
      request('/api/bmsxcx/taste/login/getmore',
          {
            thirdsess: sess,
            encry: encry,
            iv: iv,
            signature:signature,
            rawData: rawData
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          console.log('getMoreinfo',res)
      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
}
module.exports = {
  getuinfo: getuinfo,
  getminfo: getminfo,
  checksess: checksess,
  gologin: gologin,
  getin: getin,
  checkwxse:checkwxse,
  wxlogin:wxlogin
}
