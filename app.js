//app.js
App({
  onLaunch: function () {
   const userInfo = wx.getStorageSync('user');
   const self = this;
   if (!!userInfo) {
     this.globalData.userInfo = userInfo;
   }
  },
  globalData: {
    userInfo: null,
    doubanBase: "https://douban.uieee.com",
    // doubanBase: "http://t.yushu.im",
  }
})