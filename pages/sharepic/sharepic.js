// pages/sharepic/sharepic.js
const app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareImgurl:null,
    imgurl:null,
    endtime:null,
    actid:null,
    sharekey:null
  },
  saveimg:function(){
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
      if(opts.imgurl){
        this.setData({
            imgurl: opts.imgurl,
            actname: opts.actname,
            endtime: opts.endtime,
            actid: opts.actid,
            sharekey: opts.sharekey
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
    var uname = app.globalData.userInfo.nickName;
    var str1 = this.data.actname;
    var str2 = this.data.endtime+' 自动开奖';
    var ow = wx.getSystemInfoSync().windowWidth;
    var oh = wx.getSystemInfoSync().windowHeight;
    var imgw = 698;//698
    var imgh = 341;//341
    var _this = this;
    const ctx = wx.createCanvasContext('shareCanvas')
    ctx.setFillStyle('#546bff')
    ctx.fillRect(0, 0, ow, oh)

    utils.showLoading("绘图中");
    const p2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https:'+_this.data.imgurl,
        success: function (res) {
          var ileft = 0.0346 * ow; // (26/750)
          var itop = 0.196 * oh;
          var iw = imgw/750 *ow;
          var ih = imgh / imgw * iw;
          //var ih = ow / res.width * res.height
          //var itop = 0.178 * oh;
          ctx.drawImage(res.path, ileft, itop, iw, ih)
          wx.getImageInfo({
            src: "../../assets/image/sharebg.png",
            success: function (res2) {
              var ih = ow / res2.width * res2.height
              var itop = 0.178 * oh;
              ctx.drawImage("../../" + res2.path, 0, itop, ow, ih)
              //文字1
              ctx.setTextAlign('left')    // 文字居中
              ctx.setFillStyle('#000000')  // 文字颜色：黑色
              var fz = (30 / 750) * ow
              var nlen = str1.length;
              var zlen = fz * nlen;
              var ileft = ow *58/750;
              var itop = 636 / 750 * ow;
              ctx.setFontSize(fz)         // 文字字号：22px
              ctx.fillText(str1, ileft, itop + fz / 2)
              //文字2
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
    const p3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: app.globalData.userInfo.avatarUrl,
        success: function (res) {
          var ileft = 0.416 * ow; (312 / 750)
          var itop = 0.033 * oh;
          var iw = 128 / 750 * ow;
          //var ih = ow / res.width * res.height
          //var itop = 0.178 * oh;
          ctx.drawImage(res.path, ileft, itop, iw, iw)
          wx.getImageInfo({
            src: "../../assets/image/cov.png",
            success: function (res) {
              var ileft = 0.41 * ow; // (308/750)
              var itop = 0.031 * oh; // (37/1195)
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
    //二维码
    utils.request('/api/bmsxcx/taste/login/getqcode',
        {
          actid: _this.data.actid,
          sharekey: _this.data.sharekey
        },
        "POST", 2, function (res) {
        wx.hideLoading()
        _this.setData({
            shareImgurl: res.data
        });
    },function(res){
        wx.hideLoading()
        //utils.showModal('提示', res.errMsg,false);
    });
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token',
    //   method: 'GET',
    //   data: {
    //     appid: 'wxd40ba3259097c636',
    //     secret: 'b8c4a93fcdd267e33914625a19f9ffd5',
    //     grant_type:'client_credential'
    //   },
    //   success: function (res) {
    //     var _url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token;
    //     wx.request({
    //       url: _url,
    //       method: 'POST',
    //       data: {
    //         scene:'id=1',
    //         width: 430,
    //         path: "pages/detail/detail"
    //       },
    //       success: function (res) {
    //         console.log(res)
    //         _this.setData({
    //           //shareImgurl: sdata
    //         });
    //       }
    //     })
    //   }
    // })
    Promise.all([p2,p3]).then(function (datas) {
      console.log(datas)
      ctx.setTextAlign('center')    // 文字居中
      ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
      ctx.draw()
      wx.hideLoading()
    }, function (err) {

    })
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