// pages/index/index.js
const app = getApp()
var utils = require('../../utils/util.js');
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
    islogin:false,
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
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {  //若拿不到授权信息
          wx.authorize({
            scope: 'scope.userInfo',
            success() {

            },
            fail(){
              console.log('未授权1')
            }
          })
        }
        else {
          console.log('已授权')
          wx.getUserInfo({
            success: (res) => {
              that.setData({
                isauth:true
              });
              console.log(res)
              app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
              app.globalData.userInfo.nickName = res.userInfo.nickName;
              //console.log(app.globalData.userInfo.avatarUrl)
              that.setData({
                nickName: app.globalData.userInfo.nickName
              })
              that.getin(); //登录自身服务器

              //that.getMoreinfo(wx.getStorageSync('thirdSession'),res.encryptedData,res.iv,res.signature,res.rawData)

            }
          })
          //that.UserLogin();
        }
      }
    })
  },
  getMoreinfo: function(sess,encry,iv,signature,rawData){  //获取敏感信息unionid,前提是在一个开放平台下的应用

      utils.request('/myapi/api/bmsxcx/taste/login/getmore',
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
  },
  getin:function(){
      var that = this;
      utils.showLoading("数据加载中");
      utils.request('/myapi/api/bmsxcx/taste/login/checkuser',
          {
            thirdsess: wx.getStorageSync('thirdSession'),
            username: that.data.nickName,
            avatarurl: app.globalData.userInfo.avatarUrl
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          //console.log(res)
          if(res.data.status == 1){
              console.log(res.data.msg);
              that.setData({
                islogin: true
              })
              that.getList();

          }
      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  getList(){
      var that = this;
      utils.request('/myapi/api/bmsxcx/taste/list/getActlist',
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
    var that = this;

    if(app.globalData.userInfo.nickName){
       that.setData({
          nickName: app.globalData.userInfo.nickName
       })
       that.getin(); //登录自身服务器
    }

    if(app.globalData.userInfo.isauth){
       that.setData({
          isauth:true
       });
    }
    app.userInfoReadyCallback = res =>{

      if(!app.globalData.userInfo.isauth){
          console.log('userinfo',res);
          app.globalData.userInfo.nickName = res.userInfo.nickName;
          app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl;
          console.log(app.globalData.userInfo.nickName);

          that.setData({
            nickName: app.globalData.userInfo.nickName
          })
          that.getin(); //登录自身服务器

          that.setData({
              isauth:true
          });
          //that.getMoreinfo(wx.getStorageSync('thirdSession'),res.encryptedData,res.iv,res.signature,res.rawData)
      }

    };
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