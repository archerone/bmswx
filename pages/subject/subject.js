// pages/subject/subject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      {
        name: '问卷测试',
        img: '/assets/image/test.png',
        type: 2
      },
      {
        name: '组队活动',
        img: '/assets/image/ztuan.png',
        type: 1
      }
    ]
  },
  gosubinfo(e){
    const {type} = e.currentTarget.dataset;
    console.log(type)
    wx.navigateTo({
      url: '../subject-list/subject-list?type='+type,
    })
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