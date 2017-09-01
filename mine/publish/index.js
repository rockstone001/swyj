// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "is_android": 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
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
  scanEnter: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        if (res.result) {
          //返回isbn 通过isbn获取书本信息
          var isbn = res.result;
          wx.request({
            url: getApp().globalData.Config.apiHost + 'book/get_book',
            data: {
              token: wx.getStorageSync('token'),
              isbn: isbn
            },
            success: function (res) {
              if (res.data.code == 0) {
                // 获取图书信息成功  进入图书确认页面
                wx.navigateTo({
                  url: 'step2?book=' + JSON.stringify(res.data.msg)
                });
              } else if (res.data.code == 205) {
                // 无法获取图书信息 是否进入手动录入页面
                //先提示用户没有获取到图书信息
                wx.showModal({
                  title: '操作提示',
                  content: '没有该图书的信息, 点击确定手工录入！',
                  success: function (res) {
                    if (res.confirm) {
                      //跳转到发布图书 手工录入
                      wx.navigateTo({
                        url: 'publish_step2?book=' + JSON.stringify({
                          isbn: isbn
                        })
                      });
                    }
                  }
                });

              } else {
                // 各种失败
                wx.showModal({
                  title: '错误提示',
                  content: res.data.msg,
                  showCancel: false
                });
              }
            },
            fail: function (data) {
              wx.showModal({
                title: '错误提示',
                content: '未能获取图书信息！',
                showCancel: false
              });
            }
          });
        }
      }
    });
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})