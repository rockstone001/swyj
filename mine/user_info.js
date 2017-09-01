// user_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    username: '',
    if_send: false,
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
          is_android: res.platform == 'android'
        });
      }
    });
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/get_userinfo',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          res.data.msg.if_send = res.data.msg.if_send == '1' ? true : false;
          that.setData(res.data.msg);
        }
      },
      fail: function (data) {
        wx.showModal({
          title: '错误提示',
          content: '未能获取用户数据！',
          showCancel: false
        });
      }
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
  
  },
  save: function (e) {
    wx.request({
      url: getApp().globalData.Config.apiHost + 'user/save_user_info?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: e.detail.value,
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.showModal({
            title: '操作提示',
            content: '保存成功！',
            showCancel: false
          });
        }
      },
      fail: function (data) {
        wx.showModal({
          title: '错误提示',
          content: '未能保存用户数据！',
          showCancel: false
        });
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})