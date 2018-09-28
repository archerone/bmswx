// pages/detail/detail.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openShare:false, //是否打开分享弹层
    actid:null,  //活动id
    actdata:[],  //活动详情数据
    status:0,    //活动状态,是否开奖(0未开奖,1开奖,2过期)
    iswin:0,     //是否中奖
    isfull:false,//团是否满员
    otimes:0,    //距离结束开奖时间
    stimes:0,    //距离活动开始时间
    isbegin:false,  //活动是否开始
    isend:false,    //活动是否结束
    iscreat:false,  //当前用户是否已开团
    actid:null,     //活动id
    joinman:[],     //最新参与的8个用户
    joinkey:null,   //分享时带的参数
    sharekey:null,  //接收到的分享参数
    gleader:null,   //团长
    isgetg:0,       //是否领取
    joineds:0,      //活动当前参与人数
    maxjoins:0,     //活动最大人数上限
    winmans:[],     //中奖名单
    actname:null,    //奖项名称
    islogin:false
  },
  gohome(){ //返回主页
      wx.switchTab({
          url: '../index/index'
      })
  },
  getprize(){  //跳至领奖页面
      wx.navigateTo({
          url: '../gprize/gprize'
      })
  },
  joingroup(){ //加入团队
      var that = this;
      utils.showModal('提示','入团后无法加入其它团',function(res){
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
            joinman: res.data.list,
            joineds: res.data.joineds
          })

      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  opengroup(){  //开团
      var that = this;
      utils.showModal('提示','开团后不能参与其它团',function(res){
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
              if(res.data.rescode==0){
                  wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                  })
              }else{
                  that.initact(res);
              }

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

        if(res.data.status==1){
            that.setData({
                winmans:res.data.winmans
            })
        }
        if(res.data.groupmans.length>0){
            var isfull = res.data.groupmans.length>=res.data.groupnum?true:false;
            var iscreat = res.data.groupmans.length>0?true:false;
            that.setData({
                isfull: isfull,
                iscreat: iscreat
            })
            for(var i=0;i<res.data.groupmans.length;i++){
                if(res.data.groupmans[i]['jointype']==1){
                    that.setData({
                        gleader: res.data.groupmans[i]['username'],
                        joinkey: res.data.groupmans[i]['groupkey']
                    })
                }
                if(res.data.groupmans[i]['username']==app.globalData.userInfo.nickName){
                    var isgetg = res.data.groupmans[i]['status'];
                    var iswin = res.data.groupmans[i]['iswin'];
                    that.setData({
                        isgetg: isgetg,
                        iswin: iswin
                    })
                }
            }
        }

        that.checktime(begin,end)  //根据时间判断状态

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
            otimes: otimes,
            actname: res.data.actname,
            maxjoins: res.data.maxjoins?res.data.maxjoins:0
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
  gosharePic: function (e) {  //跳转至画图页面
    console.log('dddddd',e.currentTarget.dataset.ishow)
    if(e.currentTarget.dataset.ishow==2){
      var _url = '../sharepic/sharepic?imgurl='+this.data.actdata.actimg+'&actname='+this.data.actname+'&sharetype=2';
    }else{
      var _url = '../sharepic/sharepic?imgurl='+this.data.actdata.actimg+'&actname='+this.data.actname+'&endtime='+this.data.actdata.endtime+'&actid='+this.data.actid+'&sharekey='+this.data.joinkey+'&sharetype=1';
    }

    wx.navigateTo({
      url: _url
    })
    this.hideModal();
  },
  goInvite:function(){  //拉起邀请弹窗
    var _this = this;
    this.showModal();
  },
  showModal: function () {  // 显示遮罩层
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
  hideModal: function () {  // 隐藏遮罩层
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
  checklogin(){
     var that = this;
     if(!wx.getStorageSync('thirdSession')){
        that.setData({
          islogin: false
        })
     }else{
        utils.showLoading("数据加载中");
        login.checkwxse(function(){
            that.setData({
              islogin: true
            })
         },function(){
            that.setData({
              islogin: false
            })
         })
     }
  },
  wxlogin(){
     var that = this;
     if(!that.data.islogin){
          login.wxlogin(that)
      }else{
          that.getin();
      }
  },
  getin:function(){  //登录活动服务器
      var that = this;
      login.getin(app.globalData.userInfo.nickName,app.globalData.userInfo.avatarUrl,function(res){
        console.log(res.data.msg);
        if(res.data.status == 1){
            that.getact();
        }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var sharekey = '';
    if(options.scene){
       var sharekey = decodeURIComponent(options.scene);
    }
    if(options.sharekey){
       var sharekey = options.sharekey;
    }
    that.setData({
      actid: options.actid,
      sharekey: sharekey
    })
    utils.showLoading("数据加载中");
    that.getact();
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
    this.checklogin()
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
      if(this.data.islogin){
        this.getact()
      }
      wx.stopPullDownRefresh()
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