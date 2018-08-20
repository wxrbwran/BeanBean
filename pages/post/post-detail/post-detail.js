import { DBPost } from '../../../db/DBPost.js'; 
const app = getApp();

Page({
  _dbPost: null,
  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    postId: null,
    isPlayingMusic: false,
  },
  onMusicTap() {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.post.music.url,
        title: this.data.post.music.title,
        coverImgUrl: this.data.post.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.data.post.postId;
    }
  },
  setMusicMonitor() {
    const self = this;
    wx.onBackgroundAudioStop(() => {
      self.setData({ isPlayingMusic: false });
    })
  },
  setAnimation() {
    const animationUp = wx.createAnimation({
      timingFunction: 'ease-in-out',
    })
    this.animationUp = animationUp;
  },
  onUpTap(e){
    const { postId } = e.currentTarget.dataset;
    const post = this._dbPost.up();
    console.log(post);
    const self = this;
    this.setData({ 
      'post.upStatus': post.upStatus,
      'post.upNum': post.upNum,
     });
     this.animationUp.scale(2).step();
     this.setData({
       animationUp: this.animationUp.export(),
     });
    setTimeout(() => {
      self.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export(),
      });
    }, 300)
     wx.showToast({
       title: post.upStatus ? '点赞成功' : '取消点赞',
       duration: 1000,
       icon: 'success',
       mask: true,
     })
  },
  onCommentTap(e) {
    const { postId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../post-comment/post-comment?id=${postId}`,
    })
  },
  onCollectionTap(e) {
    const { postId } = e.currentTarget.dataset;
    const post = this._dbPost.collect();
    console.log(post);
    this.setData({
      'post.collectionStatus': post.collectionStatus,
      'post.collectionNum': post.collectionNum,
    });
    wx.showToast({
      title: post.upStatus ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'success',
      mask: true,
    })
  },
  //阅读量+1
  addReadingTimes() {
    this._dbPost.addReadingTimes();
  },
  getDetail(postId) {
    console.log(postId);
    const post = this._dbPost.getPostItemById();
    this.setData({ post, postId });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.id);
    this._dbPost = new DBPost(options.id);
    this.getDetail(options.id);
    this.addReadingTimes();
    this.setMusicMonitor();
    this.setAnimation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.post.title,
    })
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
    wx.stopBackgroundAudio();
    this.setData({ isPlayingMusic: false });
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
    const { post, postId } = this.data;
    return {
      title: post.title,
      desc: post.content,
      path: `/pages/post/post-detail/post-detail?id=${postId}`
    }
  }
})