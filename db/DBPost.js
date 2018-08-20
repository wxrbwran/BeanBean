import moment from '../utls/miment.js';

class DBPost{
  constructor(postId){
    this.storageKeyName = 'postList';
    this.postId = postId;
  }
  getAllPostData(){
    let res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.executeSetStorageSync(res);
    }
    return res;
  }
  executeSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data)
  }
  getPostItemById(){
    const postList = this.getAllPostData();
    const data = postList.filter(l => l.postId === +this.postId)[0];
    return data;
  }
  collect(){
    return this.updatePostData("collect");
  }
  getCommentData() {
    var { comments } = this.getPostItemById();
    comments.sort((a, b) => a.create_time - b.create_time);
    const handledComments = comments
    .map(c => {
      // console.log(+c.create_time);
      c.create_time = moment((+c.create_time) * 1000, 'x').format('YYYY-MM-DD');
      return c;
    });
    console.log(handledComments);
    return handledComments;
  }
  up() {
    return this.updatePostData("up");
  }
  newComment(newComment) {
    this.updatePostData('comment', newComment);
  }
  //阅读数+1
  addReadingTimes() {
    this.updatePostData('reading');
  }
  updatePostData(category, newComment) {
    var postData = this.getPostItemById(),
      allPostData = this.getAllPostData();
    switch (category) {
      case 'collect':
        //处理收藏
        console.log(postData.upStatus);
        if (!postData.collectionStatus) {
          //如果当前状态是未收藏
          postData.collectionNum++;
          postData.collectionStatus = true;
        } else {
          // 如果当前状态是收藏
          postData.collectionNum--;
          postData.collectionStatus = false;
        }
        break;
      case 'up':
        console.log(postData.upStatus);
        if (!postData.upStatus) {
          postData.upNum++;
          postData.upStatus = true;
        } else {
          postData.upNum--;
          postData.upStatus = false;
        }
        break;
      case 'comment':
        postData.comments.push(newComment);
        postData.commentNum++;
        break;
      case 'reading':
        postData.readingNum++;
        break;
      default:
        break;
    }
    allPostData[postData.index] = postData;
    this.executeSetStorageSync(allPostData);
    return postData;
  }
}
export { DBPost }
