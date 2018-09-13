// pages/subject-list/subject-list.js
import cfg from '../../common/config/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    page: 1,
    size: 6,
    loading: true,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const {type} = options;
      this.setData({type});
      this.loadMovies();
  },

  scrollmore() {
    const { page } = this.data;
    this.setData({
      page: page + 1
    });
    this.loadMovies();
  },

  goDetail(e) {
    const { movieData } = e.currentTarget.dataset;
    const { _id } = movieData;
    this.saveData(movieData);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + _id,
    })
  },
  saveData(data) {
    let history = wx.getStorageSync('history') || [];
    history = history.filter((item) => {
      return item._id !== data._id
    })

    history.unshift(data)
    wx.setStorageSync('history', history)
  },
  loadMovies() {
    const { size, page, type } = this.data;
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({ loading: true });
    var _this = this;
    wx.request({
      url: `${cfg.domain}/list?type=${type}&page=${page}&size=${size}`,
      success(res) {
        console.log(res);
        const { data } = res.data;
        const movies = _this.data.movies;

        for (let i = 0; i < data.length; i += 2) {
          movies.push([data[i], data[i + 1] ? data[i + 1] : null]);
        }

        _this.setData({ movies, loading: false });
        wx.hideLoading()
      }
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