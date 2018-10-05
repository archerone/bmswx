import cfg from '../common/config/index.js'
let postUrl = cfg.domain;
var utils = require('./util.js');


/*获取微信用户信息*/
function getuinfo(fn) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {  //若拿不到授权信息
          wx.authorize({
            scope: 'scope.userInfo',
            success() {

            },
            fail(){
              console.log('未授权1')
              wx.removeStorageSync('thirdsess')
              wx.removeStorageSync('nickName');
              wx.removeStorageSync('avatarUrl');
            }
          })
        }
        else {
          console.log('已授权')
          wx.getUserInfo({
            success: (res) => {
              // if (that.userInfoReadyCallback) {
              //   that.userInfoReadyCallback(res)
              // }
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
/*用微信授权登录,成功后参与活动*/
function wxlogin(fn){
    wx.showLoading("数据加载中");
    getuinfo(function(res){  //获取授权
          wx.setStorageSync('avatarUrl',res.userInfo.avatarUrl);
          wx.setStorageSync('nickName',res.userInfo.nickName);

          gologin(function(){ //登陆sess
              if(fn){
                fn();
              }
          });
          //login.getminfo(wx.getStorageSync('thirdsess'),res.encryptedData,res.iv,res.signature,res.rawData)
    })
}
/*参与活动*/
function getin(username,avar,fn){
      var that = this;
      utils.request('/api/bmsxcx/taste/login/checkuser',
          {
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
          getuinfo(function(res){
                var avatarUrl = res.userInfo.avatarUrl?res.userInfo.avatarUrl:'https://res.beimsn.com/xcx/noavar.png';
                var nickName = res.userInfo.nickName;
                wx.setStorageSync('avatarUrl',avatarUrl);
                wx.setStorageSync('nickName',nickName);

                if(fn1){
                  fn1();
                }
                //login.getminfo(wx.getStorageSync('thirdsess'),res.encryptedData,res.iv,res.signature,res.rawData)
          })
       },
       fail:function(){
          wx.hideLoading()
          wx.removeStorageSync('thirdsess')
          wx.removeStorageSync('nickName');
          wx.removeStorageSync('avatarUrl');
          if(fn2){
            fn2();
          }
       }
    });
}
/*微信第三方后台会话状态判断,登录时用到*/
function checksess(fn1,fn2){
    var thirdsess = wx.getStorageSync('thirdsess');
    wx.checkSession({
       success:function(){
          if(thirdsess){  //wx的session未过期,还需判断thirdsess是否过期
              utils.request('/api/bmsxcx/taste/login/islogin', {thirdsess: thirdsess}, "POST", 2, function (res) {
                  wx.hideLoading()
                  if(res.data==1){ //1,已登录
                      console.log('wx.session未过期;thirdsess也未过期,已刷新');
                      if(fn1){
                        fn1();
                      }
                  }else{//0,未登录
                      //若wx的session未过期,thirdsess过期,那再进行一次登录
                      wx.hideLoading()
                      wx.removeStorageSync('thirdsess')
                      wx.removeStorageSync('nickName');
                      wx.removeStorageSync('avatarUrl');
                      if(fn2){
                        fn2();
                      }
                  }
              },function(res){
                  wx.removeStorageSync('thirdsess')
                  wx.removeStorageSync('nickName');
                  wx.removeStorageSync('avatarUrl');
                  wx.hideLoading()
                  //utils.showModal('提示', res.errMsg,false);
              });
          }else{
              //若登录状态thirdsess被删
              wx.removeStorageSync('thirdsess')
              wx.removeStorageSync('nickName');
              wx.removeStorageSync('avatarUrl');
              wx.hideLoading()
              if(fn2){
                fn2();
              }
          }
       },
       fail:function(){
          wx.removeStorageSync('thirdsess')
          wx.removeStorageSync('nickName');
          wx.removeStorageSync('avatarUrl');
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
                console.log('getopenid');
                utils.request('/api/bmsxcx/taste/login/getopenid', {code: wxres.code}, "POST", 2, function (res) {
                    wx.hideLoading()
                    console.log('登录微信成功')
                    if(res.data.code == 702){
                        wx.setStorageSync('thirdsess', res.data.access_token);
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
      utils.request('/api/bmsxcx/taste/login/getmore',
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
  gologin: gologin,
  getin: getin,
  checkwxse:checkwxse,
  wxlogin:wxlogin
}
