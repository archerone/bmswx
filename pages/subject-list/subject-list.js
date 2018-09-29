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
    nomore:false,
    sublist:[],
    type:null,
    isplayer:true
  },
  gosub(){
    wx.switchTab({
      url: '../subject/subject'
    })
  },
  checklogin(){
     var that = this;
     if(!wx.getStorageSync('thirdsess')){
        that.setData({
          islogin: false
        })
     }else{
        utils.showLoading("数据加载中");
        login.checkwxse(function(){
            that.setData({
              islogin: true
            })
            if(that.data.isplayer){
                that.setData({
                    page: 0,
                    nomore:false,
                    sublist:[]
                })
                that.getList();
            }
         },function(){
            that.setData({
              islogin: false
            })
         })
     }
     console.log(this.data.islogin)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
      this.setData({
        type:opts.type
      })
      console.log('load')
      this.getList();
  },

  scrollmore() {
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
  goDetail(e) {
    var _url = '../detail/detail?actid='+e.currentTarget.dataset.actid;
    wx.navigateTo({
      url: _url
    })
  },
  getList(){
      var that = this;
      if(wx.getStorageSync('thirdsess')){
          that.setData({
            isplayer:false
          })
      }else{
          that.setData({
            isplayer:true
          })
      }
      utils.request('/api/bmsxcx/taste/list/getActlist',
          {
            num: that.data.page,
            numget: that.data.size,
            type: that.data.type
          },
          "POST", 2, function (res) {
          wx.hideLoading()
          const {data} = res;
          if(data.length==0){
            that.setData({
              nomore: true
            })
          }
          if(data.length>0){
              const sublist = that.data.sublist;
              for(let i=0;i<data.length;i++){
                  var now = new Date().getTime();
                  var res_endtime = data[i].endtime.replace(/\-/g, "/");
                  var end = new Date(res_endtime).getTime();
                  data[i]['isend'] = false;
                  if(now>=end || data[i].status!=0){ //活动时间过了，或者状态不为未开奖
                      data[i]['isend'] = true;
                  }
                  sublist.push(data[i]);
              }

              that.setData({
                  sublist:sublist
              });
          }


      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
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
      var that = this;
      if(this.data.type==1){
        wx.setNavigationBarTitle({
          title: '活动分类-组团活动列表'
        })
      }else if(this.data.type==2){
        wx.setNavigationBarTitle({
          title: '活动分类-问卷测试列表'
        })
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