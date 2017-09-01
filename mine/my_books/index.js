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
    actionSheetItems: ['编辑'],
    hiddenmodalput: true,
    borrow_days: 0,
    "is_android": 1,
    tips: '正在加载',
    currentId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          totalHeight: res.windowHeight - (res.platform == 'android' ? 46 : 0),
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
    this.setData({
      id: 0,
      noMore: false,
      books: [],
      isLoading: false,
      tips: '正在加载'
    });
    this.get_my_books();
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

  get_my_books: function () {
    var id = this.data.id;
    var noMore = this.data.noMore;
    var isLoading = this.data.isLoading;
    var that = this;
    if (!noMore && !isLoading) {
      that.setData({
        isLoading: 1
      });
      wx.request({
        url: getApp().globalData.Config.apiHost + 'book/get_my_books',
        data: {
          id: id,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log(res);
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
            content: '未能获取我的图书！',
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
  loadMore: function (e) {
    this.get_my_books();
  },
  listenerButton: function (e) {
    var id = e.currentTarget.dataset.id;
    var book = this.getBook(id);
    var actionSheetItems = ['编辑','设置外借天数'];
    if (book.if_recommend == 0) {
      actionSheetItems.push('推荐');
    } else {
      actionSheetItems.push('取消推荐');
    }
    if (book.book_user != '') {
      actionSheetItems.push('拒绝预约');
    }
    if (book.state == 2) {
      // actionSheetItems.push({
      //   'listener': 'cuihuan',
      //   'text': '催还图书',
      //   'id': id
      // });
      actionSheetItems.push('赠予外借人');
    }
    this.setData({
      actionSheetItems: actionSheetItems,
      currentId: id
    });
    this.openActionSheet();
  },
  getBook: function (id) {
    var book = [];
    for (var i = 0; i < this.data.books.length; i++) {
      if (this.data.books[i].id == id) {
        book = this.data.books[i];
        break;
      }
    }
    return book;
  },
  openActionSheet: function () {
    var that = this;
    var actionSheetItems = that.data.actionSheetItems;
    var id = that.data.currentId;
    wx.showActionSheet({
      itemList: actionSheetItems,
      success: function (res) {
        if (!res.cancel) {
          switch (actionSheetItems[res.tapIndex]) {
            case '编辑':
              wx.navigateTo({
                url: '/mine/my_books/my_book?id=' + id,
              });
              break;
            case '设置外借天数':
              that.set_borrow_time(id);
              break;
            case '推荐':
              that.recommend(id);
              break;
            case '取消推荐':
              that.cancel_recommend(id);
              break;
            case '拒绝预约':
              that.cancel_book(id);
              break;
            case '赠予外借人':
            that.send_book(id);
              break;
          }
        }
      }
    });
  },
  set_borrow_time: function (id) {
    var book = this.getBook(id);
    this.setData({
      hiddenmodalput: false,
      id: id,
      borrow_days: book.borrow_days
    });
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  confirm: function () {
    wx.showLoading({
      title: '正在保存',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/set_borrow_days?token=' + wx.getStorageSync('token'),
      method: "POST",
      header: {
        "Content-Type": 'application/x-www-form-urlencoded'
      },
      data: {
        id: that.data.id,
        borrow_days: that.data.borrow_days
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.cancel();
          wx.showModal({
            title: '操作提示',
            content: '保存成功！',
            showCancel: false,
            success: function (res) {
              var books = that.data.books;
              for (var i = 0; i < books.length; i++) {
                if (books[i].id == that.data.id) {
                  books[i].borrow_days = that.data.borrow_days;
                  that.setData({
                    books: books
                  })
                  break;
                }
              }
            }
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
          content: '保存失败，请重试！',
          showCancel: false
        });
      }
    });
  },
  borrowDaysInput: function (e) {
    this.setData({
      borrow_days: e.detail.value
    })
  },
  recommend: function (id) {
    wx.showLoading({
      title: '正在设置推荐',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/recommend?token=' + wx.getStorageSync('token'),
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
            content: '推荐成功！',
            showCancel: false,
            success: function (res) {
              var books = that.data.books;
              for (var i = 0; i < books.length; i++) {
                if (books[i].id == id) {
                  books[i].if_recommend = 1;
                  console.log(i);
                  console.log(books[i]);
                  break;
                }
              }
              that.setData({
                books: books
              });
              console.log(that.data.books);
            }
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
          content: '未能设置成推荐，请重试！',
          showCancel: false
        });
      }
    });
  },
  cancel_recommend: function (id) {
    wx.showLoading({
      title: '正在取消推荐',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.Config.apiHost + 'book/cancel_recommend?token=' + wx.getStorageSync('token'),
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
            content: '推荐取消成功！',
            showCancel: false,
            success: function (res) {
              var books = that.data.books;
              for (var i = 0; i < books.length; i++) {
                if (books[i].id == id) {
                  books[i].if_recommend = 0;
                  that.setData({
                    books: books
                  })
                  break;
                }
              }
            }
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
          content: '未能取消推荐，请重试！',
          showCancel: false
        });
      }
    });
  },
  cancel_book: function (id) {
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定要拒绝预约吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.Config.apiHost + 'user/cancel_book?token=' + wx.getStorageSync('token'),
            method: "POST",
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: function (res1) {
              wx.hideLoading();
              if (res1.data.code == 0) {
                that.cancel();
                wx.showModal({
                  title: '操作提示',
                  content: '拒绝预约成功！',
                  showCancel: false,
                  success: function (res2) {
                    var books = that.data.books;
                    for (var i = 0; i < books.length; i++) {
                      if (books[i].id == id) {
                        books[i].book_user = res1.data.msg.book_user;
                        that.setData({
                          books: books
                        })
                        break;
                      }
                    }
                  }
                });
              } else {
                wx.showModal({
                  title: '错误提示',
                  content: res1.data.msg,
                  showCancel: false
                });
              }
            },
            fail: function (data) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: '保存失败，请重试！',
                showCancel: false
              });
            }
          });
        }
      }
    })
  },
  send_book: function (id) {
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定要赠予外借人吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.Config.apiHost + 'user/send_book?token=' + wx.getStorageSync('token'),
            method: "POST",
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: function (res1) {
              wx.hideLoading();
              if (res1.data.code == 0) {
                that.cancel();
                wx.showModal({
                  title: '操作提示',
                  content: '赠予成功！',
                  showCancel: false,
                  success: function (res2) {
                    var books = that.data.books;
                    for (var i = 0; i < books.length; i++) {
                      if (books[i].id == id) {
                        books.splice(i, 1);
                        that.setData({
                          books: books
                        })
                        break;
                      }
                    }
                  }
                });
              } else {
                wx.showModal({
                  title: '错误提示',
                  content: res1.data.msg,
                  showCancel: false
                });
              }
            },
            fail: function (data) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: '赠予失败，请重试！',
                showCancel: false
              });
            }
          });
        }
      }
    });
  },
  cuihuan: function (id) {
    var that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定要催还图书吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.Config.apiHost + 'user/cuihuan?token=' + wx.getStorageSync('token'),
            method: "POST",
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            data: {
              id: id
            },
            success: function (res1) {
              wx.hideLoading();
              if (res1.data.code == 0) {
                that.cancel();
                wx.showModal({
                  title: '操作提示',
                  content: '催还成功！',
                  showCancel: false,
                  success: function (res2) {

                  }
                });
              } else {
                wx.showModal({
                  title: '错误提示',
                  content: res1.data.msg,
                  showCancel: false
                });
              }
            },
            fail: function (data) {
              wx.hideLoading();
              wx.showModal({
                title: '错误提示',
                content: '催还失败，请重试！',
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