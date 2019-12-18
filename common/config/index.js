var apiurl = "https://api.beimsn.com";
wx.getSystemInfo({
  success: function(res) {
    if(res.platform == 'devtools'){
    	apiurl = "http://10.199.5.79/gitlab/bms_api";
    }else{
    	apiurl = "https://api.beimsn.com";
    }
  }
})

export default {
  domain: apiurl
}