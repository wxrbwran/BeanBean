const util = require('../../../utls/util.js')

const app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    const { movieId } = options;
    const { doubanBase } = app.globalData;
    var url = doubanBase + "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData)
  },
   processDoubanData(data) {
      if (!data) {
          return;
      }
      var director = {
          avatar: "",
          name: "",
          id: ""
      }
      if (data.directors[0] != null) {
        if (data.directors[0].avatars != null) {
            director.avatar = data.directors[0].avatars.large
        }
        director.name = data.directors[0].name;
        director.id = data.directors[0].id;
      }
      const movie = {
        movieImg: data.images ? data.images.large : "",
        country: data.countries[0],
        title: data.title,
        originalTitle: data.original_title,
        wishCount: data.wish_count,
        commentCount: data.comments_count,
        year: data.year,
        generes: data.genres.join("、"),
        stars: util.convertToStarsArray(data.rating.stars),
        score: data.rating.average,
        director: director,
        casts: util.convertToCastString(data.casts),
        castsInfo: util.convertToCastInfos(data.casts),
        summary: data.summary
      }
      this.setData({ movie });
      wx.setNavigationBarTitle({
        title: data.title
      });
  },
  //预览电影海报
  viewMoviePostImg(event) {
    const src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src, 
      urls: [src] 
    })
  }
})