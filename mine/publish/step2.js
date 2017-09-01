// steps.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "title": "",
    "subtitle": "",
    "pic": "",
    "author": "",
    "summary": "",
    "publisher": "",
    "pubplace": "",
    "pubdate": "",
    "page": 0,
    "price": 0.00,
    "binding": "",
    "isbn": "",
    "isbn10": "",
    "keyworkd": "",
    "edition": "",
    "impression": "",
    "language": "",
    "format": "",
    "class": "",
    "types": [
      "儿童", "教辅", "小说", "管理", "文学", "成功励志", "青春文学", "历史", "哲学宗教", "传记", "保健养生", "亲子家教", "科技"
    ],
    "type": -1,
    "upload_file": '',
    "id": 0,
    "is_android": 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var book = JSON.parse(options.book);
    this.setData(book);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          is_android: res.platform == 'android'
        });
      }
    }); 
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
  
  },

  bindPickerChange: function (e) {
    this.setData({
      "type": e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          "upload_file": tempFilePaths[0],
          "pic": tempFilePaths[0]
        });
      }
    });
  },
  save: function (e) {
    var title = e.detail.value.title;
    var isbn = e.detail.value.isbn;
    var author = e.detail.value.author;
    var _type = e.detail.value.type;
    e.detail.value.id = this.data.id;
    if (_type == -1) {
      wx.showModal({
        title: '操作提示',
        content: '请选择分类！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(title)) {
      wx.showModal({
        title: '操作提示',
        content: '书名不能为空！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(isbn)) {
      wx.showModal({
        title: '操作提示',
        content: 'ISBN不能为空！',
        showCancel: false
      });
      return;
    }
    if (/^\s*$/.test(author)) {
      wx.showModal({
        title: '操作提示',
        content: '作者不能为空！',
        showCancel: false
      });
      return;
    }
    wx.showLoading({
      title: '正在发布',
      mask: true
    });
    if (this.data.upload_file != "") {
      //上传图片和数据
      wx.uploadFile({
        url: getApp().globalData.Config.apiHost + 'book/upload?token=' + wx.getStorageSync('token'),
        filePath: this.data.pic,
        name: 'pic',
        formData: e.detail.value,
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          var data = JSON.parse(res.data);
          if (data.code == 0) {
            wx.showModal({
              title: '操作提示',
              content: '保存成功！',
              showCancel: false,
              success: function (res) {
                // console.log(res);
                if (res.confirm) {
                  //跳转到我的图书
                  wx.redirectTo({
                    url: '/mine/my_books/index'
                  });
                }
              }
            });
          }
        },
        fail: function (data) {
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '未能保存图书数据, 请重试！',
            showCancel: false
          });
        }
      });
    } else {
      //不上传图片 只保存数据
      wx.request({
        url: getApp().globalData.Config.apiHost + 'book/save_book?token=' + wx.getStorageSync('token'),
        method: "POST",
        header: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        data: e.detail.value,
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.code == 0) {
            wx.showModal({
              title: '操作提示',
              content: '保存成功！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  //跳转到我的图书
                  wx.redirectTo({
                    url: '/mine/my_books/index'
                  });
                }
              }
            });
          }
        },
        fail: function (data) {
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: '未能保存图书数据, 请重试！',
            showCancel: false
          });
        }
      })
    }

  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})