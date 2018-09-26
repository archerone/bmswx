// pages/user/user.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:"",
    nickName:'未知',
    winlist: [],
    joinlist:[],
    winactid:[],
    joinactid:[]
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.userInfo.avatarUrl) {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName
      });
      this.getuact();
    }
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