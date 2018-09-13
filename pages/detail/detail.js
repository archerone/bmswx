// pages/detail/detail.js
const app = getApp()
var utils = require('../../utils/util.js');
Page({
  onShareAppMessage: function () {
    return {
      title: '小程序抽奖',
      path: '/page/detail?initiator=118',
      imageUrl:'../../assets/image/peo1.jpg',
      success:function(res){
          console.log('33')
      },
      fail:function(res){
        console.log('44')
      }
    }
  },
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
    joinman:[]
  },
  getjoman(){
      var that = this;
      utils.request('/myapi/api/bmsxcx/taste/login/getjoins',
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
  opengroup(){
      var that = this;
      utils.showModal('提示','开团成功后可以邀请好友加入',function(res){
          if(res.confirm){
              utils.request('/myapi/api/bmsxcx/taste/login/joins',
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
  getact(){
      var that = this;
      utils.request('/myapi/api/bmsxcx/taste/list/getActinfo',
          {
            actid: that.data.actid,
            thirdsess: wx.getStorageSync('thirdSession')
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          console.log(res)
          var isfull = res.data.groupmans.length>5?true:false;
          var iscreat = res.data.groupmans.length>0?true:false;
          var now = new Date().getTime();
          var end = new Date(res.data.endtime).getTime();
          var begin = new Date(res.data.begintime).getTime();
          var otime = end - now;
          var otimes = utils.getRemainderTime(otime)
          var stime = begin - now;
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
              isfull: isfull,
              iscreat: iscreat,
              actid: res.data.id,
              otimes: otimes
          })
          console.log(that.data.actdata,that.data.isfull)
          that.getjoman();
      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  checktime(begin,end){
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        actid: options.actid
      })
      this.getact();
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

  }
})