import { DBPost } from '../../../db/DBPost.js';

Page({
  _dbPost: null,
  /**
   * 页面的初始数据
   */
  data: {
    useKeyboardFlag: true,
    comments: [],
    keyboardInputValue: null,
    chooseFiles: [],
    sendMoreMsgFlag: false,
    deleteIndex: null,
  },
  switchInputType() {
    const action = 'useKeyboardFlag';
    const { useKeyboardFlag } = this.data;
    this.setData({ [action]: !useKeyboardFlag });
  },
  sendMoreMsg() {
    const { sendMoreMsgFlag } = this.data;
    this.setData({ sendMoreMsgFlag: !sendMoreMsgFlag });
  },
  bindCommentInput(e) {
    // console.log(e);
    const { value } = e.detail;
    this.setData({ keyboardInputValue: value });
  },
  //选择本地照片与拍照
  chooseImage(event) {
    // 已选择图片数组
    const imgArr = this.data.chooseFiles;
    const length = imgArr.length;
    //只能上传3张照片，包括拍照
    if (length < 3) {
      var sourceType = [event.currentTarget.dataset.category],
        that = this;
      wx.chooseImage({
        count: 3 - length,
        sourceType: sourceType,
        success: function (res) {
          // 可以分次选择图片，但总数不能超过3张
          that.setData({
            chooseFiles: imgArr.concat(res.tempFilePaths)
          });
        }
      })
    }
  },
  //删除已经选择的图片
  deleteImage(event) {
    const index = event.currentTarget.dataset.idx;
    const { chooseFiles } = this.data;
    const self = this;
    this.setData({
      deleteIndex: index
    });
    chooseFiles.splice(index, 1);
    setTimeout(function () {
      self.setData({
        deleteIndex: null,
        chooseFiles,
      });
    }, 500)
  },
  //开始录音
  recordStart() {
    var self = this;
    this.setData({
      recodingClass: 'recoding'
    });
    this.startTime = new Date();
    wx.startRecord({
      success: function (res) {
        console.log('success');
        var diff = (self.endTime - self.startTime) / 1000;
        diff = Math.ceil(diff);
        //发送录音
        self.submitVoiceComment({ url: res.tempFilePath, timeLen: diff });
      },
      fail: function (res) {
        console.log('fail');
        console.log(res);
      },
      complete: function (res) {
        console.log('complete');
        console.log(res);
      }
    });
  },
  //结束录音
  recordEnd() {
    this.setData({
      recodingClass: ''
    });
    this.endTime = new Date();
    wx.stopRecord();
  },
  //提交录音 
  submitVoiceComment(audio) {
    var newData = {
      username: "青石",
      avatar: "/images/avatar/avatar-3.png",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: '',
        img: [],
        audio: audio
      },
    };
    //保存新评论到缓存数据库中
    this._dbPost.newComment(newData);
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
    var comments = this._dbPost.getCommentData();
    //重新渲染并绑定所有评论
    this.setData({
      comments: comments,
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    });
  },
  playAudio(event) {
    var url = event.currentTarget.dataset.url,
      self = this;
    //暂停当前录音
    if (url == this.data.currentAudio) {
      wx.pauseVoice();
      this.data.currentAudio = ''
    }
    //播放录音
    else {
      this.data.currentAudio = url;
      wx.playVoice({
        filePath: url,
        complete: function () {
          //只有当录音播放完后才会执行
          self.data.currentAudio = '';
          console.log('complete')
        },
        success: function () {
          console.log('success')
        },
        fail: function () {
          console.log('fail')
        }
      });
    }
  },
  // 提交用户评论
  submitComment(e) {
    var imgs = this.data.chooseFiles;
    var newData = {
      username: "青石",
      avatar: "/images/avatar/avatar-3.png",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img: imgs
      },
    };
    if (!newData.content.txt && imgs.length === 0) {
      return;
    }
    //保存新评论到缓存数据库中
    this._dbPost.newComment(newData);
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
    //重新渲染并绑定所有评论
    var comments = this._dbPost.getCommentData();
    // 绑定评论数据
    //恢复初始状态
    this.setData({
      comments: comments,
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id } = options;
    this._dbPost = new DBPost(id);
    const comments = this._dbPost.getCommentData();
    this.setData({ comments });
  },
  previewImg(e){
    const { imgIdx, commentIdx } = e.currentTarget.dataset;
    const imgs = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
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