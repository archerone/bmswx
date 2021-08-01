var apiurl = "https://api.beimsn.com";
wx.getSystemInfo({
  success: function(res) {
    if(res.platform == 'devtools'){
      apiurl = "https://api.beimsn.com";
    }else{
    	apiurl = "https://api.beimsn.com";
    }
  }
})

export default {
  domain: apiurl
}