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
            success(res) {

            },
            fail(){
              console.log('未授权1')
              wx.hideLoading()
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
var u_code = null;
var u_res = null;
function wxlogin(fn){
    //p1.获取code
    const p1 = new Promise(function(resolve, reject){
        wx.showLoading("数据加载中");
        wx.login({
            success: wxres => {
              if(wxres.code){
                u_code = wxres.code;
                resolve();
              }else{
                reject()
              }
            }
        })
    })
    //p2.获取用户信息
    const p2 = new Promise(function(resolve, reject){
        wx.showLoading("数据加载中");
        getuinfo(function(res){
            console.log(res)
            wx.setStorageSync('avatarUrl',res.userInfo.avatarUrl);
            wx.setStorageSync('nickName',res.userInfo.nickName);
            u_res = res;
            resolve();

        })
    })

    //生成thirdsess,保存openid和sesskey
    Promise.all([p1,p2]).then(function () {
       console.log('getopenid');
       utils.request('/api/bmsxcx/taste/login/getopenid', {code: u_code}, "POST", 2, function (res) {
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
       });
    }, function (err) {

    })


}

/*参与活动*/
function getin(fn){
      var that = this;

      utils.request('/api/bmsxcx/taste/login/checkuser',
          {
            username: wx.getStorageSync('nickName'),
            avatarurl: wx.getStorageSync('avatarUrl'),
            encry: u_res.encryptedData,
            iv: u_res.iv,
            signature: u_res.signature,
            rawData: u_res.rawData
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
                  fn1(res);
                }

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

/*获取用户敏感信息*/
function getminfo(encry,iv,signature,rawData,fn){  //获取敏感信息unionid,前提是在一个开放平台下的应用
      utils.request('/api/bmsxcx/taste/login/getmore',
          {
            encry: encry,
            iv: iv,
            signature:signature,
            rawData: rawData
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          console.log('getMoreinfo',res)
          if(fn){
            fn();
          }
      },function(res){
          wx.hideLoading()
          if(fn){
            fn();
          }
          //utils.showModal('提示', res.errMsg,false);
      });
}
module.exports = {
  getuinfo: getuinfo,
  getin: getin,
  checkwxse:checkwxse,
  wxlogin:wxlogin
}
