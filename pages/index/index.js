// pages/index/index.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:[],
    page:0,
    size:3,
    loading:true,
    isauth:false,
    nickName:'',
    litems:[],
    nomore:false
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
          //login.getminfo(wx.getStorageSync('thirdSession'),res.encryptedData,res.iv,res.signature,res.rawData)
     })
  },
  getin:function(){
        var that = this;
        login.getin(app.globalData.userInfo.nickName,app.globalData.userInfo.avatarUrl,function(res){
            if(res.data.status == 1){
                console.log(res.data.msg);
                app.globalData.userInfo.islogin = true;
                that.getList();
            }
        })
  },
  getList(){
      var that = this;
      utils.request('/api/bmsxcx/taste/list/getActlist',
          {
            num: that.data.page,
            numget: that.data.size,
            thirdsess: wx.getStorageSync('thirdSession')
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
    if(!app.globalData.userInfo.islogin){
        utils.showLoading("数据加载中");
        login.checksess(function(){
           login.gologin();
        })
    }
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