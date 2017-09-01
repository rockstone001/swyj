// book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "id": 0,
    'nickname': '',
    'headimgurl': '',
    "title": "",
    "subtitle": "",
    "pic": "",
    "author": "",
    "summary": "",
    "publisher": "",
    "pubdate": "",
    "page": 0,
    "price": 0.00,
    "isbn": "",
    "is_booked": 0,
    "winWidth": 0,
    "winHeight": 0,
    "is_android": 1,
    "borrower": "",
    "remain_days": ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBook(options.id);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
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
    wx.showLoading({
      title: '正在加载数据',
      mask: true
    });
  },
  getBook: function (id) {
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/get_book_by_id',
      data: {
        id: id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData(res.data.msg);
        }
      },
      fail: function (data) {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能获取我的图书！',
          showCancel: false
        });
      }
    })
  },
  book: function () {
    var id = this.data.id;
    var title = this.data.is_booked ? '正在取消预约' : '正在预约';
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
          that.setData(res.data.msg);
          wx.showModal({
            title: '操作提示',
            content: res.data.msg.is_booked == 1 ? '预约成功' : '取消预约成功',
            showCancel: false
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
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})