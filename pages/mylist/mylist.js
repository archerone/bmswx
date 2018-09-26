const app = getApp()
var utils = require('../../utils/util.js');
var login = require('../../utils/login.js');
Page({
  data: {
    page:0,
    size:3,
    actid:[],
    nomore:false,
    mylist:[],
    tid:null
  },
  gouser(){
    wx.switchTab({
      url: '../user/user'
    })
  },
  onLoad(opts){
    this.setData({
      actid:opts.actid,
      tid:opts.tid
    })
    console.log(this.data.actid)
    this.getList();
  },
  onShow (options) {
    if(this.data.tid==1){
      wx.setNavigationBarTitle({
        title: '我的活动-已参与'
      })
    }else if(this.data.tid==2){
      wx.setNavigationBarTitle({
        title: '我的活动-中奖信息'
      })
    }

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

  getList(){
      var that = this;
      utils.request('/api/bmsxcx/taste/list/getmylist',
          {
            num: that.data.page,
            numget: that.data.size,
            actid: that.data.actid,
            thirdsess: wx.getStorageSync('thirdSession')
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
              const mylist = that.data.mylist;
              for(let i=0;i<data.length;i++){
                  var now = new Date().getTime();
                  var res_endtime = data[i].endtime.replace(/\-/g, "/");
                  var end = new Date(res_endtime).getTime();
                  data[i]['isend'] = false;
                  data[i]['isjoin'] = true;
                  if(now>=end || data[i].status!=0){ //活动时间过了，或者状态不为未开奖
                      data[i]['isend'] = true;
                  }
                  mylist.push(data[i]);
              }

              that.setData({
                  mylist:mylist
              });
          }


      },function(res){
          wx.hideLoading()
          //utils.showModal('提示', res.errMsg,false);
      });
  },

  goDetail(e) {
    var _url = '../detail/detail?actid='+e.currentTarget.dataset.actid;
    wx.navigateTo({
      url: _url
    })
  }
})