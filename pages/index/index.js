// pages/index/index.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
    size:3,
    nickName:'',
    litems:[],
    nomore:false,
    islogin:false
  },
  checklogin(){
     var that = this;
     if(!wx.getStorageSync('thirdsess')){
        that.setData({
          islogin: false
        })
        that.getList();
     }else{
        utils.showLoading("数据加载中");
        login.checkwxse(function(){
            that.setData({
              islogin: true
            })
            that.getList();
         },function(){
            that.setData({
              islogin: false
            })
            that.getList();
            utils.showModal('提示','微信登录过期,请重新登录',function(res){
                if(res.confirm){
                   wx.switchTab({
                      url: '../user/user',
                      success: function (e) {
                        var page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                        page.onLoad();
                      }
                   })
                }else{

                }
            },function(){

            })
         })
     }
  },
  scrollmore(){
    if(this.data.nomore){
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    const {page} = this.data;
    this.setData({
      page:page+1
    });
    this.getList();
  },
  goTest(e){
      var _url = '../wxtest/wxtest?acturl='+e.currentTarget.dataset.acturl;
      wx.reLaunch({
        url: _url
      })
  },
  getList(){
      var that = this;
      utils.showLoading("加载中...");
      utils.request('/api/bmsxcx/taste/list/getactlist',
          {
            num: that.data.page,
            numget: that.data.size
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          //that.litems = res.data;
          const {data} = res;
          if(data.length==0){
            that.setData({
              nomore: true
            })
          }
          const litems = that.data.litems;

          for(let i=0;i<data.length;i++){
              var now = new Date().getTime();
              var res_endtime = data[i].endtime.replace(/\-/g, "/");
              var end = new Date(res_endtime).getTime();
              data[i]['isend'] = false;
              if(now>=end || data[i].status!=0){ //活动时间过了，或者状态不为未开奖
                  data[i]['isend'] = true;
                  console.log(data[i])
              }
              litems.push(data[i]);
          }

          that.setData({
              litems: litems
          })


      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  goDetail(e){
    var _url = '../detail/detail?actid='+e.currentTarget.dataset.actid;
    wx.navigateTo({
      url: _url
    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     //this.checklogin()
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