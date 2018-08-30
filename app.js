App({
  onLaunch: function () {
   const userInfo = wx.getStorageSync('user');
   if (!!userInfo) {
     this.globalData.userInfo = userInfo;
   }
  },
  onShow(){
    const self = this;
    wx.login({
      success(res) {
        console.log(res);
        self.globalData.code = res.code;
      }
    })
  },
  globalData: {
    code: null,
    userInfo: null,
    doubanBase: "https://douban.uieee.com",
    // doubanBase: "http://t.yushu.im",
  }
})