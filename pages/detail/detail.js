// pages/detail/detail.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openShare:false,
    actid:null,
    actdata:[],
    status:0,
    iswin:0,
    isfull:false,
    otimes:0,
    stimes:0,
    isbegin:false,
    isend:false,
    iscreat:false,
    actid:null,
    joinman:[],
    joinkey:null,
    sharekey:null,
    gleader:null,
    isgetg:0,
    isauth:false
  },
  joingroup(){
      var that = this;
      utils.showModal('提示','入团成功后无法再加入别的团',function(res){
          if(res.confirm){
              utils.request('/api/bmsxcx/taste/login/joins',
                  {
                    username: app.globalData.userInfo.nickName,
                    actid: that.data.actid,
                    groupkey: that.data.sharekey
                  },
                  "POST", 2, function (res) {
                  wx.hideLoading()
                  console.log(res)
                  if(res.data.rescode==0){
                     wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                     })
                     return false;
                  }
                  var _url = '../detail/detail?actid='+that.data.actid;
                  wx.redirectTo({
                      url: _url
                  })

              },function(res){
                  wx.hideLoading()
                  //utils.showModal('提示', res.errMsg,false);
              });
          }
      },function(){})
  },
  getjoman(){  //获取最近参与的用户信息（8人）
      var that = this;
      utils.request('/api/bmsxcx/taste/login/getjoins',
          {
            actid: that.data.actid
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          console.log(res)
          that.setData({
            joinman: res.data
          })

      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  opengroup(){  //开团
      var that = this;
      utils.showModal('提示','开团成功后可以邀请好友加入,不能加入别的团',function(res){
          if(res.confirm){
              utils.request('/api/bmsxcx/taste/login/joins',
                  {
                    username: app.globalData.userInfo.nickName,
                    actid: that.data.actid
                  },
                  "POST", 2, function (res) {
                  wx.hideLoading()
                  console.log(res)
                  if(res.data.rescode==0){
                     wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                     })
                     return false;
                  }
                  var _url = '../detail/detail?actid='+that.data.actid;
                  wx.redirectTo({
                      url: _url
                  })

              },function(res){
                  wx.hideLoading()
                  //utils.showModal('提示', res.errMsg,false);
              });
          }
      },function(){})
  },
  getact(){   //获取活动信息
      var that = this;
      utils.showLoading("数据加载中");
      if(that.data.sharekey){  //受邀打开页面
          utils.request('/api/bmsxcx/taste/list/getActinfo',
              {
                actid: that.data.actid,
                sharekey: that.data.sharekey
              },
              "POST", 2, function (res) {
              wx.hideLoading()
              console.log(res)
              if(res.data.groupmans){
                that.initact(res);
              }
          },function(res){
              wx.hideLoading()
              //utils.showModal('提示', res.errMsg,false);
          });
      }else{
          utils.request('/api/bmsxcx/taste/list/getActinfo',
              {
                actid: that.data.actid,
                thirdsess: wx.getStorageSync('thirdSession')
              },
              "POST", 2, function (res) {
              wx.hideLoading()
              console.log(res)
              that.initact(res);
          },function(res){
              wx.hideLoading()
              //utils.showModal('提示', res.errMsg,false);
          });
      }
  },
  initact(res){  //初始化活动信息
        var that = this;
        var now = new Date().getTime();
        var res_endtime = res.data.endtime.replace(/\-/g, "/");
        var res_begintime = res.data.begintime.replace(/\-/g, "/");
        var end = new Date(res_endtime).getTime();
        var begin = new Date(res_begintime).getTime();
        var otime = end - now;
        var otimes = utils.getRemainderTime(otime)
        var stime = begin - now;
        if(res.data.groupmans.length>0){
          var isfull = res.data.groupmans.length>=res.data.groupnum?true:false;
          var iscreat = res.data.groupmans.length>0?true:false;
          var iswin = res.data.groupmans[0]['iswin'];
          that.setData({
              isfull: isfull,
              iscreat: iscreat,
              iswin: iswin
          })
        }

        that.checktime(begin,end)  //根据时间判断状态

        for(var i=0;i<res.data.groupmans.length;i++){
            if(res.data.groupmans[i]['jointype']==1){
                that.setData({
                    gleader: res.data.groupmans[i]['username'],
                    joinkey: res.data.groupmans[i]['groupkey']
                })
            }
            if(res.data.groupmans[i]['username']==app.globalData.userInfo.nickName){
                var isgetg = res.data.groupmans[i]['status'];
                that.setData({
                    isgetg: isgetg
                })
            }
        }
        console.log(that.data.gleader,that.data.joinkey)

        if(stime>0){ //未到开始时间,倒计时
            var time = null;
            clearInterval(time);
            time = setInterval(function(){
                if(stime<=0){
                   clearInterval(time);
                   that.checktime(begin,end)
                    return false;
                }
                stime-=1000;
                that.setData({
                  stimes: utils.getRemainderTime(stime)
                })
            },1000);
        }

        if(otime>0){  //活动还未结束时,倒计时
            var timer =null;
            clearInterval(timer);
            timer = setInterval(function(){
               if(otime<=0){
                  clearInterval(timer);
                  that.checktime(begin,end)
                  return false;
               }
               otime-=1000;
               otimes = utils.getRemainderTime(otime)
               that.setData({
                  otimes: otimes
               })
            },1000)
        }
        console.log(otime,otimes)
        that.setData({
            actdata: res.data,
            status: res.data.status,
            actid: res.data.id,
            otimes: otimes
        })
        console.log(that.data.actdata,that.data.isfull,that.data.iswin)
        that.getjoman();
  },
  checktime(begin,end){  //初始化时间状态
      var that = this;
      var now = new Date().getTime();
      var otime = end - now;
      var stime = now - begin;
      if(otime<=0){ //活动时间过了
          that.setData({
              isend: true
          })
      }
      if(stime>0){ //已到开始时间
          that.setData({
              isbegin: true
          })
      }
  },
  gosharePic: function () {  //跳转至画图页面
    wx.navigateTo({
      url: '../sharepic/sharepic'
    })
    this.hideModal();
  },
  goInvite:function(){  //拉起邀请弹窗
    var _this = this;
    this.showModal();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      openShare: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        openShare: false
      })
    }.bind(this), 200)
  },
  getUserInfo: function () {
     var that = this;
     login.getuinfo(this,function(res){
          app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
          app.globalData.userInfo.nickName = res.userInfo.nickName;
          app.globalData.userInfo.isauth = true;
          that.setData({
            nickName: app.globalData.userInfo.nickName,
            isauth:true
          })
          that.getin(); //登录自身服务器
      })
  },
  getin:function(){
      var that = this;
      login.getin(app.globalData.userInfo.nickName,app.globalData.userInfo.avatarUrl,function(res){
        console.log(res.data.msg);
        if(res.data.status == 1){
           app.globalData.userInfo.islogin = true;
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sharekey = options.sharekey?options.sharekey:'';
    if(app.globalData.userInfo.isauth){
        var isauth = app.globalData.userInfo.isauth;
    }
    that.setData({
      actid: options.actid,
      sharekey: sharekey,
      isauth: isauth
    })
    utils.showLoading("数据加载中");
    login.checksess(function(){
        login.gologin(function(){
            that.getact();
        });
    },function(){
        that.getact();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '抽奖详情'
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来拼团抽奖',
      path: '/pages/detail/detail?actid='+this.data.actid+'&sharekey='+this.data.joinkey,
      success:function(res){
          console.log('33')
      },
      fail:function(res){
        console.log('44')
      }
    }
  },
})