import cfg from '../common/config/index.js'
let postUrl = cfg.domain;
/**
 * 网络-发起请求
 */
function request(url, data, method, headertype, successCallback, failCallback, completeCallback) {
  //var sessionId = wx.getStorageSync("sessionId");
  if(wx.getStorageSync("thirdsess")){
      //小程序暂时无法设置request header,把thirdsess带入每次请求参数中
      data['thirdsess'] = wx.getStorageSync('thirdsess');
  }

  if(headertype == 2){
      var header = {'content-type': 'application/x-www-form-urlencoded'}
  }else{
      var header = {'content-type': 'application/json'}
  }

  //获取网络类型。
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType
      if (networkType == "none") {
        showModal('提示', '没有网络可用');
      } else {
        wx.request({
          url: postUrl + url, //仅为示例，并非真实的接口地址
          data: data,
          method: method ? method : 'GET',
          header: header,
          success: function(res){
             if(res.data.code==704){
                wx.removeStorageSync('thirdsess');
                showModal('提示',res.data.msg,function(res){
                  if(res.confirm){
                      var pages = getCurrentPages()
                      var currentPage = pages[pages.length-1] 
                      console.log(currentPage,currentPage.options.sharekey)
                      if(currentPage.options.sharekey){
                          var url = '/'+currentPage.route+'?actid='+currentPage.options.actid+'&sharekey='+currentPage.options.sharekey; 
                      }
                      else{
                          var url = '/'+currentPage.route+'?actid='+currentPage.options.actid;
                      }
                      if(currentPage.route=="pages/detail/detail"){
                          wx.redirectTo({
                            url: url
                          })
                      }else{
                          wx.switchTab({
                            url: '../index/index'
                          })
                      }
                  }else{
                      var pages = getCurrentPages()
                      var currentPage = pages[pages.length-1] 
                      var url = '/'+currentPage.route+'?actid='+currentPage.options.actid 
                      if(currentPage.route=="pages/detail/detail"){
                          wx.redirectTo({
                            url: url
                          })
                      }else{
                          wx.switchTab({
                            url: '../index/index'
                          })
                      }
                  }
                },function(){})
             }else{
                successCallback(res);
             }
          },
          fail: failCallback,
          complete: completeCallback
        });
      }
    }
  })
}

/**
 * 界面-提示框
 */
function showToast(title, status, duration, maskBool, successCallback, failCallback, completeCallback) {
  wx.showToast({
    title: title ? title : '',
    image: '../../images/icon_' + status + '.png',
    duration: duration ? duration : 2000,
    mask: maskBool ? maskBool : false,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  });
}

/**
 * 界面-加载中
 */
function showLoading(title, maskBool, successCallback, failCallback, completeCallback) {
  wx.showLoading({
    title: title ? title : '',
    mask: maskBool ? maskBool : true,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  });
}

/**
 * 界面-模态弹窗
 */
function showModal(title, content, successCallback, failCallback, completeCallback, showCancel, cancelText, cancelColor, confirmText, confirmColor) {
  wx.showModal({
    title: title ? title : '提示',
    content: content ? content : '',
    showCancel: showCancel ? showCancel : true,
    cancelText: cancelText ? cancelText : '取消',
    cancelColor: cancelColor ? cancelColor : '',
    confirmText: confirmText ? confirmText : '确定',
    confirmColor: confirmColor ? confirmColor : '#ff6933',
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  })
}

/**
 * 界面-显示操作菜单
 */
function showActionSheet(itemList, itemColor, successCallback, failCallback, completeCallback) {
  wx.showActionSheet({
    itemList: itemList,
    itemColor: itemColor,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  })
}

/**
 * 数据缓存-异步存储
 */
function setStorage(key, data, successCallback, failCallback, completeCallback) {
  wx.setStorage({
    key: key,
    data: data,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  });
}

/**
 * 数据缓存-异步获取
 */
function getStorage(key, successCallback, failCallback, completeCallback) {
  wx.getStorage({
    key: key,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback,
  });
}

/**
 * 拨打电话
 */
function makePhoneCall(phone, successCallback, failCallback, completeCallback) {
  wx.makePhoneCall({
    phoneNumber: phone,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  });
}

/**
 * 导航 - 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
 * url:跳转页面路径
*/
function navigateTo(url, successCallback, failCallback, completeCallback) {
  wx.navigateTo({
    url: url,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  });
}

/**
 * 导航-关闭当前页面，跳转到应用内的某个页面。
 * url：调转页面路径
 */
function redirectTo(url, successCallback, failCallback, completeCallback) {
  wx.redirectTo({
    url: url,
    success: successCallback,
    fail: failCallback,
    complete: completeCallback
  })
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value == arr[i]) {
      return true;
    }
  }
  return false;
}
var formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const dateFormat = (format, time) => {
  let dt = new Date();
  if (time) {
    if (typeof time !== 'number') {
      time = time.toString().replace(/-/g, '/')
    }
    dt = new Date(time);
  }
  var date = {
    "M+": dt.getMonth() + 1,
    "d+": dt.getDate(),
    "h+": dt.getHours(),
    "m+": dt.getMinutes(),
    "s+": dt.getSeconds(),
    "q+": Math.floor((dt.getMonth() + 3) / 3),
    "S+": dt.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
    }
  }
  return format
}

//剩余时间戳转为日期格式
function getRemainderTime (ntime){
    var ntime = Math.floor(ntime/1000);
    var day = Math.floor(ntime/86400);
    var hour = Math.floor(ntime%86400/3600);
    var minute = Math.floor(ntime%86400%3600/60);
    var secs = Math.floor(ntime%86400%3600%60);
    return day+'天'+hour+'小时'+minute+'分钟'+secs+'秒';
}

module.exports = {
  request: request,
  showToast: showToast,
  showLoading: showLoading,
  showModal: showModal,
  showActionSheet: showActionSheet,
  setStorage: setStorage,
  getStorage: getStorage,
  makePhoneCall: makePhoneCall,
  navigateTo: navigateTo,
  redirectTo: redirectTo,
  isInArray: isInArray,
  formatTime: formatTime,
  dateFormat: dateFormat,
  getRemainderTime: getRemainderTime
}
