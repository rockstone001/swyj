// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "winWidth": 0,
    "winHeight": 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    }); 
    console.log(that.data);
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

  scanEnter: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.result) {
          wx.showLoading({
            title: '正在借阅',
            mask: true
          });
          wx.request({
            url: res.result + '&token=' + wx.getStorageSync('token'),
            method: "GET",
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == 0) {
                wx.navigateTo({
                  url: 'borrowed?result=' + JSON.stringify(res.data.msg)
                });
              }
            },
            fail: function (data) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: '未能完成借阅，请重试！',
                showCancel: false
              });
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
          title: '错误提示',
          content: '未能完成借阅，请重试！',
          showCancel: false
        });
      }
    });
  }
})