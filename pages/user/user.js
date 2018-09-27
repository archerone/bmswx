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
    nickName:'未知',
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
  gologin(){

  },
  gotoDetail(e) {
    const { actid } = e.currentTarget.dataset
    const { tid } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../mylist/mylist?actid=' + actid+'&tid='+tid
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
            thirdsess: wx.getStorageSync('thirdSession')
          },
          "POST", 2, function (res) {
          wx.hideLoading()

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

          app.globalData.userInfo.avatarUrl = res.data[0]['avatarurl'];
          app.globalData.userInfo.nickName = res.data[0]['username']
          that.setData({
              avatarUrl: res.data[0]['avatarurl'],
              nickName: res.data[0]['username']
          })
          console.log(that.data.joinlist)


      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  wxlogin(){
     var that = this;
     if(!that.data.islogin){
          login.wxlogin(that)
     }else{
          that.getin();
     }
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
            that.getuact();
         },function(){
            that.setData({
              islogin: false
            })
         })
     }
  },

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
    this.getuact()
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