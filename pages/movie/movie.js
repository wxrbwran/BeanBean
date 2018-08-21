// pages/movie/movie.js
const app = getApp();
const util = require('../../utls/util.js')

Page({
  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    containerShow: false,
  },
  getMovieListData(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
      "content-type": "json"
      },
      success(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
        that.setData({ containerShow: true });
      },
      fail(error) {
        // fail
        console.log(error)
      },
    })
  },
  processDoubanData(moviesDouban, settedKey, categoryTitle) {
    const movies = [];
    console.log(moviesDouban)
    for (let subject of moviesDouban.subjects) {
      // const subject = moviesDouban.subjects[idx];
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      const temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    const readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { doubanBase } = app.globalData;
    const nameSpace = '/v2/movie/';
    const params = '?start=0&count=3';
    const inTheatersUrl = `${doubanBase}${nameSpace}in_theaters${params}`;
    const comingSoonUrl = `${doubanBase}${nameSpace}coming_soon${params}`;
    const top250Url = `${doubanBase}${nameSpace}top250${params}`;
    wx.showNavigationBarLoading();
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在上映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣250'); 
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