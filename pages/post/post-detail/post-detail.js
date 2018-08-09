import { DBPost } from '../../../db/DBPost.js'; 

Page({
  _dbPost: null,
  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    postId: null,
  },
  onUpTap(e){
    const { postId } = e.currentTarget.dataset;
    const post = this._dbPost.up();
    console.log(post);
    this.setData({ 
      'post.upStatus': post.upStatus,
      'post.upNum': post.upNum,
     });
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