// pages/sharepic/sharepic.js
const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareImgurl:'',
    imgurl:'',
    endtime:'',
    actid:'',
    sharekey:'',
    sharetype:1,
    islogin:false,
    showModal: false
  },
  showcov(){
    this.setData({
      showModal: true
    })
  },
  hidecov(){
    this.setData({
      showModal: false
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
        that.setData({
          islogin: true
        })
        if(that.data.sharetype==2){
            wx.setNavigationBarTitle({
              title: '炫耀一下'
            })
            that.showtime();
        }else{
            wx.setNavigationBarTitle({
              title: '分享抽奖'
            })
            that.getqcode();
        }
     }
  },
  saveimg:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        that.setData({
          showModal: false
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            that.hidecov()
            wx.showModal({
              content: '图片已保存到相册，赶紧晒一下吧~',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }, fail: function (res) {
                console.log(11111)
              }
            })
          }
        })
      }
    })
  },
  getqcode(){
      var _this = this;
      //二维码
      utils.request('/api/bmsxcx/taste/login/getqcode',
          {
            actid: _this.data.actid,
            sharekey: _this.data.sharekey
          },
          "POST", 2, function (res) {
          console.log(res,'getqcode')
          wx.hideLoading()
          _this.setData({
              shareImgurl: res.data
          });
          _this.drawpage();
      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },
  showtime(){
      app.globalData.userInfo.nickName = wx.getStorageSync('nickName');
      var that=this;
      var uname = app.globalData.userInfo.nickName;
      var str1 = '奖品:'+this.data.actname;
      var str2 = '我中奖啦！';
      var str3 = '长按识别小程序来试试运气吧';
      var ow = wx.getSystemInfoSync().windowWidth;
      var oh = wx.getSystemInfoSync().windowHeight;
      var imgw = 550;//698
      var imgh = 268;//341
      var _this = this;
      const ctx = wx.createCanvasContext('shareCanvas',this)
      ctx.setFillStyle('#546bff')
      ctx.fillRect(0, 0, ow, oh)

      utils.showLoading("绘图中");
      //背景
      const p0 = new Promise(function(resolve, reject){
          wx.getImageInfo({
              src: "../../assets/image/bg-dot2.png",
              success: function (res2) {
                var ih = ow / res2.width * res2.height
                var itop = 0;
                ctx.drawImage("../../" + res2.path, 0, itop, ow, ih)
                resolve();
              }
            })
      })
      //头像信息
      const p1 = new Promise(function (resolve, reject) {
        app.globalData.userInfo.avatarUrl = wx.getStorageSync('avatarUrl');
        wx.getImageInfo({
          src: app.globalData.userInfo.avatarUrl,
          success: function (res) {
            var ileft = 0.416 * ow;
            var itop = 0.273 * ow;
            var iw = 128 / 750 * ow;
            //var ih = ow / res.width * res.height
            //var itop = 0.178 * oh;
            ctx.drawImage(res.path, ileft, itop, iw, iw)
            wx.getImageInfo({
              src: "../../assets/image/head-pic.png",
              success: function (res) {
                var ileft = 0.41 * ow; // (308/750)
                var itop = 0.24 * ow; // (37/1195)
                var iw = 135 / 750 * ow;
                var ih = 161 / 750 * ow;
                ctx.drawImage("../../" + res.path, ileft, itop, iw, ih)
                //用户名
                ctx.setTextAlign('center')    // 文字居中
                ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
                var fz = (25 / 750) * ow
                var nlen = uname.length;
                var zlen = fz * nlen;
                var ileft = ow / 2
                var itop = 0.5 * ow;
                ctx.setFontSize(fz)         // 文字字号：22px
                ctx.fillText(uname, ileft, itop + fz / 2)

                resolve();
              }
            })
          }
        })
      });

      //奖项信息
      const p2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: 'https:'+_this.data.imgurl,
          success: function (res) {
            var ileft = 0.135 * ow; // (26/750)
            var itop = 0.65 * ow;
            var iw = imgw/750 *ow;
            var ih = imgh / imgw * iw;
            ctx.drawImage(res.path, ileft, itop, iw, ih)
            //中奖标题
            ctx.setTextAlign('left')    // 文字居中
            ctx.setFillStyle('#ff5d5d')  // 文字颜色：黑色
            var fz = (40 / 750) * ow
            var nlen = str2.length;
            var zlen = fz * nlen;
            var ileft = ow *300/750;
            var itop = 0.58 * ow;
            ctx.setFontSize(fz)         // 文字字号：22px
            ctx.fillText(str2, ileft, itop + fz / 2)
            //奖品名文字
            ctx.setTextAlign('left')    // 文字居中
            ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
            var fz = (30 / 750) * ow
            var nlen = str1.length;
            var zlen = fz * nlen;
            var ileft = ow *200/750;
            var itop = 1.08 * ow;
            ctx.setFontSize(fz)         // 文字字号：22px
            ctx.fillText(str1, ileft, itop + fz / 2)
            resolve();
          }
        })
      });

      //二维码
      const p3 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: 'https://res.beimsn.com/images/xcx/bmsxcx.jpg',
          success: function (res) {
            var ileft = 0.36 * ow; //(312 / 750)
            var itop = 1.18 * ow;
            var iw = 200 / 750 * ow;
            //var ih = ow / res.width * res.height
            //var itop = 0.178 * oh;
            ctx.drawImage(res.path, ileft, itop, iw, iw)
            //二维码文字
            ctx.setTextAlign('left')    // 文字居中
            ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
            var fz = (26 / 750) * ow
            var nlen = str3.length;
            var zlen = fz * nlen;
            var ileft = ow *200/750;
            var itop = 1.52 * ow;
            ctx.setFontSize(fz)         // 文字字号：22px
            ctx.fillText(str3, ileft, itop + fz / 2)
            resolve();
          }
        })
      });

      Promise.all([p0,p1,p2,p3]).then(function (datas) {
        console.log(datas)
        ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
        ctx.draw()
        wx.hideLoading()
        that.setData({
          showModal: true
        })
      }, function (err) {
        console.log(err,'绘图失败')
      })

  },
  drawpage(){
      app.globalData.userInfo.nickName = wx.getStorageSync('nickName');
      var that=this;
      var uname = app.globalData.userInfo.nickName;
      var str1 = this.data.actname;
      var str2 = this.data.endtime+' 自动开奖';
      var str3 = '长按扫描小程序码，参与抽奖';
      var ow = wx.getSystemInfoSync().windowWidth;
      var oh = wx.getSystemInfoSync().windowHeight;
      var imgw = 698;//698
      var imgh = 341;//341
      var _this = this;
    const ctx = wx.createCanvasContext('shareCanvas',this)
      //ctx.setFillStyle('#546bff')
      ctx.setFillStyle('#546bff')
      ctx.fillRect(0, 0, ow, oh)

      utils.showLoading("绘图中");
      //二维码
      const p1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: _this.data.shareImgurl,
          success: function (res) {
            var ileft = 0.36 * ow; (312 / 750)
            var itop = 1.04 * ow;
            var iw = 200 / 750 * ow;
            //var ih = ow / res.width * res.height
            //var itop = 0.178 * oh;
            ctx.drawImage(res.path, ileft, itop, iw, iw)
            //二维码文字
            ctx.setTextAlign('left')    // 文字居中
            ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
            var fz = (26 / 750) * ow
            var nlen = str3.length;
            var zlen = fz * nlen;
            var zleft = ow *200/750;
            var ztop = 1010 / 750 * ow;
            ctx.setFontSize(fz)         // 文字字号：22px
            ctx.fillText(str3, zleft, ztop + fz / 2)
            //遮罩裁切二维码
            wx.getImageInfo({
              src: "../../assets/image/cov2.png",
              success: function (res) {
                //var ileft = 0.41 * ow; // (308/750)
                //var itop = 0.031 * oh; // (37/1195)
                //var iw = 135 / 750 * ow;
                ctx.drawImage("../../" + res.path, ileft-3, itop-3, iw+6, iw+6)
                resolve();
              }
            })
          }
        })
      });
      //奖项信息
      const p2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: 'https:'+_this.data.imgurl,
          success: function (res) {
            var ileft = 0.0346 * ow; // (26/750)
            var itop = 0.3 * ow;
            var iw = imgw/750 *ow;
            var ih = imgh / imgw * iw;
            ctx.drawImage(res.path, ileft, itop, iw, ih)
            wx.getImageInfo({
              src: "../../assets/image/sharebg.png",
              success: function (res2) {
                var ih = ow / res2.width * res2.height
                var itop = 0.27 * ow;
                ctx.drawImage("../../" + res2.path, 0, itop, ow, ih)
                //奖品名文字
                ctx.setTextAlign('left')    // 文字居中
                ctx.setFillStyle('#000000')  // 文字颜色：黑色
                var fz = (30 / 750) * ow
                var nlen = str1.length;
                var zlen = fz * nlen;
                var ileft = ow *58/750;
                var itop = 636 / 750 * ow;
                ctx.setFontSize(fz)         // 文字字号：22px
                ctx.fillText(str1, ileft, itop + fz / 2)
                //时间文字
                ctx.setFillStyle('#aaaaaa')  // 文字颜色：黑色
                var fz = (22 / 750) * ow
                var nlen = str2.length;
                var zlen = fz * nlen;
                var ileft = ow * 58 / 750;
                var itop = 688 / 750 * ow;
                ctx.setFontSize(fz)
                ctx.fillText(str2, ileft, itop + fz / 2)
                resolve();
              }
            })
          }
        })
      });
      //头像信息
      const p3 = new Promise(function (resolve, reject) {
        app.globalData.userInfo.avatarUrl = wx.getStorageSync('avatarUrl');
        console.log(333, wx.getStorageSync('avatarUrl'))
        var opath = wx.getStorageSync('avatarUrl');
        if (opath.indexOf("http://thirdwx.qlogo.cn") != -1) {
          opath = opath.replace('http://thirdwx.qlogo.cn', 'https://wx.qlogo.cn')
        }
        if (opath.indexOf("https://thirdwx.qlogo.cn") != -1) {
          opath = opath.replace('https://thirdwx.qlogo.cn', 'https://wx.qlogo.cn')
        }
        wx.getImageInfo({
          src: opath,
          success: function (res) {
            console.log(res)
            var ileft = 0.416 * ow; (312 / 750)
            var itop = 0.033 * ow;
            var iw = 128 / 750 * ow;
            //var ih = ow / res.width * res.height
            //var itop = 0.178 * oh;
            ctx.drawImage(res.path, ileft, itop, iw, iw)
            wx.getImageInfo({
              src: "../../assets/image/cov.png",
              success: function (res) {
                var ileft = 0.41 * ow; // (308/750)
                var itop = 0.031 * ow; // (37/1195)
                var iw = 135 / 750 * ow;
                ctx.drawImage("../../" + res.path, ileft, itop, iw, iw)
                //用户名
                ctx.setTextAlign('center')    // 文字居中
                ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
                var fz = (25 / 750) * ow
                var nlen = uname.length;
                var zlen = fz * nlen;
                var ileft = ow / 2
                var itop = 183 / 750 * ow;
                ctx.setFontSize(fz)         // 文字字号：22px
                ctx.fillText(uname, ileft, itop + fz / 2)

                resolve();
              }
            })
          }
        })
      });

      Promise.all([p1,p2,p3]).then(function (datas) {
        console.log(datas)
        ctx.setTextAlign('center')    // 文字居中
        ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
        ctx.draw()
        that.setData({
          showModal: true
        })
        wx.hideLoading()
      }, function (err) {
        console.log(err,'绘图失败')
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
      if(opts.imgurl){
        if(opts.sharetype==2){
           this.setData({
              imgurl: opts.imgurl,
              actname: opts.actname,
              sharetype : opts.sharetype
           })
        }else{
           this.setData({
              imgurl: opts.imgurl,
              actname: opts.actname,
              endtime: opts.endtime,
              actid: opts.actid,
              sharekey: opts.sharekey,
              sharetype : opts.sharetype
           })
        }
      }
      this.checklogin();
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
      //this.checklogin();
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