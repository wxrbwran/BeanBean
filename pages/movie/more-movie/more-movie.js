const app = getApp();
const util = require('../../../utls/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    requestUrl: '',
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = []
    totalMovies = [...this.data.movies, ...movies];
    this.setData({ movies: totalMovies });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { category } = options;
    const { doubanBase } = app.globalData;
    this.setData({
      navigationTitle: category,
    });
    let dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣250":
        dataUrl = doubanBase + "/v2/movie/top250";
        break;
    }
    console.log(dataUrl);
    this.setData({ requestUrl: dataUrl });
    util.http(dataUrl, this.processDoubanData)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle
    });
    wx.showNavigationBarLoading()
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
    const { requestUrl } = this.data;
    const url = `${requestUrl}?start=0&count=20`;
    this.setData({ movies: [] });
    util.http(url, this.processDoubanData);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const { movies, requestUrl } = this.data;
    const length = movies.length;
    const nextUrl = `${requestUrl}?start=${length}&count=20`;
    wx.showNavigationBarLoading();
    util.http(nextUrl, this.processDoubanData);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})