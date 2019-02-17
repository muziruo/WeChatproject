//index.js
const app = getApp()

Page({
  gotoexamine:function(event) {
    var index = event.currentTarget.dataset.idx
    var transferinfo = JSON.stringify(this.data.networkinfo[index])
    wx.navigateTo({
      url: '../transportexamine/transportexamine?index='+ index +'&transferinfo='+transferinfo,
    })
  },

  data: {
    avatarUrl: '../index/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    transportrequest: [
      {
        contractid: 'ys20180707127',
        company: '武汉理工大学',
        deliverdate: '2018/07/07 07:07:07',
        goods: '橘子',
        shipagency: '湖北海电船舶有限公司',
        consigner: '阿华',
        consignertel: '7777777',
        goodsform: '100kg/箱',
        packstyle: '箱装',
        counts: '777',
        submittime: '2018/07/07 07:07:07'
      },
      {
        contractid: 'ys20180707527',
        company: '武汉理工大学',
        deliverdate: '2018/07/07 07:07:07',
        goods: '橘子-2',
        shipagency: '湖北海电船舶有限公司',
        consigner: '阿华',
        consignertel: '7777777',
        goodsform: '100kg/箱',
        packstyle: '箱装',
        counts: '777',
        submittime: '2018/07/07 07:07:07'
      }
    ],
    networkinfo: [],
    bottomtext: '上拉加载更多',
    currentcorsur: -1
  },

  /**
   * 加载页面
   */
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib?transferinfo='
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    /**
     * 获取待审批项目
     */
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    //console.log('用户权限：' + userright)
    wx.showToast({
      title: '正在加载数据...',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofdeliver',
        right: userright,
        corsur: -1
      },
      success:res => {
        //console.log(res.result.corsur.constructor)
        wx.hideToast()
        getinfo = res.result.datalist.data
        that.setData({
          networkinfo: getinfo,
          currentcorsur: res.result.corsur,
          bottomtext: '上拉加载更多数据'
        })
        if (JSON.stringify(getinfo) === '[]') {
          that.setData({
            bottomtext: '没有更多数据，请稍后刷新再查看'
          })
        }
      },
      fail:res => {
        wx.hideToast()
        wx.showToast({
          title: '云端函数出错,请稍后重新刷新',
          icon: 'none'
        })
      }
    })

    //console.log('当前用户头像url为：' + this.data.avatarUrl)
    app.globalData.useravatarUrl = this.data.avatarUrl
  },


  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

  /**
   * 显示页面
   */
  onShow: function() {
    const app = getApp()
    if (app.globalData.deliverdeletepage !== -1) {
      var networkinfobackup = this.data.networkinfo
      networkinfobackup.splice(app.globalData.deliverdeletepage, 1)
      this.setData({
        networkinfo: networkinfobackup
      })
    }
    app.globalData.deliverdeletepage = -1
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh:function() {
    /**
     * 获取待审批项目
     */
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    console.log('用户权限：' + userright)
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofdeliver',
        right: userright,
        corsur: -1
      },
      success: res => {
        console.log(res)
        getinfo = res.result.datalist.data
        that.setData({
          networkinfo: getinfo,
          currentcorsur: res.result.corsur,
          bottomtext: '上拉加载更多数据'
        })
        if (JSON.stringify(getinfo) === '[]') {
          that.setData({
            bottomtext: '没有更多数据了，请稍后刷新再查看'
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 下拉加载更多
   */
  onReachBottom:function() {
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    var nextcorsur = that.data.currentcorsur + 1
    this.setData({
      currentcorsur: nextcorsur
    })
    console.log('下一指针'+ this.data.currentcorsur)
    console.log('用户权限：' + userright)
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofdeliver',
        right: userright,
        corsur: nextcorsur
      },
      success: res => {
        console.log(res)
        getinfo = res.result.datalist.data
        var temporarylist = that.data.networkinfo
        var index = 0
        for (var item in getinfo) {
          temporarylist.push(getinfo[index])
          index++
        }
        that.setData({
          networkinfo: temporarylist
        })
        if (JSON.stringify(getinfo) === '[]') {
          that.setData({
            bottomtext: '没有更多数据了，请稍后刷新再查看',
          })
        }
      }
    })
  }
})
