// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    noMore: false,
    books: [],
    totalHeight: 0,
    isLoading: false,
    pageNum: 10,
    tips: '正在加载',
    "is_android": 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          totalHeight: res.windowHeight,
          is_android: res.platform == 'android'
        });
      }
    });
    this.get_borrowed_books(); 
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

  get_borrowed_books: function () {
    var id = this.data.id;
    var noMore = this.data.noMore;
    var isLoading = this.data.isLoading;
    var that = this;
    if (!noMore && !isLoading) {
      that.setData({
        isLoading: 1
      });
      wx.request({
        url: getApp().globalData.Config.apiHost + 'user/get_booked_books',
        data: {
          id: id,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.setData({
              books: that.data.books.concat(res.data.msg),
              id: res.data.msg.length > 0 ? res.data.msg[res.data.msg.length - 1].id : 0,
              noMore: res.data.msg.length < that.data.pageNum ? true : false,
              isLoading: 0
            });
            if (that.data.books.length == 0) {
              that.setData({
                tips: '暂无记录'
              });
            } else {
              if (that.data.noMore) {
                that.setData({
                  tips: '哥, 真的没了'
                });
              }
            }
          }
        },
        fail: function (data) {
          wx.showModal({
            title: '错误提示',
            content: '未能获取我的预定！',
            showCancel: false
          });
          that.setData({
            isLoading: 0,
            noMore: 0
          })
        }
      })
    }
  },
  book: function (e) {
    var id = e.target.dataset.id;
    var title = '正在取消预约';
    wx.showLoading({
      title: title,
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/book?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        id: id
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          wx.showModal({
            title: '操作提示',
            content: '取消预约成功',
            showCancel: false
          });
          var books = that.data.books;
          for (var i = 0; i < books.length; i++) {
            if (books[i].id == id) {
              books[i].state = 0;
              break;
            }
          }
          that.setData({
            books: books
          });
        } else {
          wx.showModal({
            title: '错误提示',
            content: res.data.msg,
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '网络错误，请重试！',
          showCancel: false
        });
      }
    });
  },
  loadMore: function (e) {
    this.get_borrowed_books();
  },

  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})