// pages/user/user.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"https://res.beimsn.com/xcx/noavar.png",
    nickName:'未登录',
    winlist: [],
    joinlist:[],
    winactid:[],
    joinactid:[],
    islogin:false
  },

  gotoShare() {
    wx.navigateTo({
      url: '../share/share',
    })
  },
  gotoDetail(e) {
    const { actid } = e.currentTarget.dataset
    const { tid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../mylist/mylist?actid=' + actid+'&tid='+tid
    })
  },
  refwx(){
      var that = this;
      utils.showLoading("加载中...");
      login.checkwxse(function(){
          that.setData({
            islogin: true
          })
          that.getuact();
      },function(){
          that.setData({
            islogin: false
          })
          that.getuact();
      })
  },
  getuact(){
      var that = this;
      that.setData({
        joinlist:[],
        winlist:[],
        winactid:[],
        joinactid:[]
      });
      utils.request('/api/bmsxcx/taste/list/getulist',
          {

          },
          "POST", 2, function (res) {
          wx.hideLoading()
          if(res.data.length>0){
              for(var i=0;i<res.data.length;i++){
                if(res.data[i]['iswin']==1){
                  var winlist = that.data.winlist;
                  var winactid = that.data.winactid;
                  winlist.push(res.data[i]);
                  winactid.push(res.data[i]['actid'])
                  that.setData({
                    winlist:winlist,
                    winactid:winactid
                  });
                }else{
                  var joinlist = that.data.joinlist;
                  var joinactid = that.data.joinactid;
                  joinlist.push(res.data[i]);
                  joinactid.push(res.data[i]['actid'])
                  that.setData({
                    joinlist:joinlist,
                    joinactid:joinactid
                  });
                }

              }

              console.log(that.data.joinlist)
          }else{

          }



      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.checklogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  wxlogout(){
     wx.removeStorageSync('thirdsess')
     wx.removeStorageSync('nickName');
     wx.removeStorageSync('avatarUrl');
     this.checklogin();
  },
  wxlogin(){
     var that = this;
     login.wxlogin(function(res){
        that.setData({
          islogin: true
        })
        that.getin();
        //login.getminfo(wx.getStorageSync('thirdsess'),res.encryptedData,res.iv,res.signature,res.rawData);
     })
  },
  getin:function(){  //登录活动服务器
      app.globalData.userInfo.nickName = wx.getStorageSync('nickName');
      app.globalData.userInfo.avatarUrl = wx.getStorageSync('avatarUrl');
      var that = this;
      login.getin(app.globalData.userInfo.nickName,app.globalData.userInfo.avatarUrl,function(res){
        if(res.data.code == 702){
            that.getuact()
        }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
        }
      })
  },
  checklogin(){
     var that = this;
     if(!wx.getStorageSync('thirdsess')){
        that.setData({
          islogin: false,
          joinlist:[],
          winlist:[],
          winactid:[],
          joinactid:[]
        })
     }else{
        utils.showLoading("数据加载中");
        that.setData({
          islogin: true
        })
        that.getuact();
     }
  },

  onShow: function () {
     if(!this.data.islogin){
        this.checklogin()
     }
     app.globalData.userInfo.nickName = wx.getStorageSync('nickName');
     app.globalData.userInfo.avatarUrl = wx.getStorageSync('avatarUrl');
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
    this.checklogin()
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

  }
})