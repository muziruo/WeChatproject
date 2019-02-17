// miniprogram/pages/userpage/user.js
Page({

  gotofunction:function(e) {
    var index = e.currentTarget.dataset.index
    if (index === 0) {
      wx.navigateTo({
        url: '../completeregister/completeregister',
      })
    }else if (index === 1) {
      wx.navigateTo({
        url: '../functionpage/functions',
      })
    }
  },

  userlogout: function() {
    wx.showModal({
      title: '确认',
      content: '是否注销当前账号，注销后将回到登录页面',
      showCancel: true,
      cancelText: '取消',
      confirmText: '注销',
      success(res) {
        if (res.confirm) {
          /**
           * 清除渲染条件
           */
          const app = getApp()
          app.globalData.ifAdtor = true
          /**
           * 清楚缓存的用户信息
           */
          try {
            wx.setStorageSync('useraccount', '')
            wx.setStorageSync('username', '')
            wx.setStorageSync('userpassword', '')
            wx.setStorageSync('usercompany', '')
            wx.setStorageSync('userright', '')
          } catch (e) {
          /**
           * 跳转回登录页面
           */
          }
          wx.redirectTo({
            url: '../loginpage/login',
          })
        }else if (res.cancel) {
          wx.showToast({
            title: '取消了注销',
          })
        }
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    functions: [
      {
        title: '查询登记',
      },{
        title: '关于'
      }
    ],
    userinfo: {
      username: '姓名',
      company: '公司',
      right: '权限'
    },
    avatarUrl: '../index/user-unlogin.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var rightinfo = '职务'
    var username = ''
    var usercompany = ''
    var userright = ''
    try {
      username = wx.getStorageSync('username')
      usercompany = wx.getStorageSync('usercompany')
      userright = wx.getStorageSync('userright')
    }catch(e){
      console.log('获取本地用户数据失败')
    }
    if (userright === '1') {
      rightinfo = '管理人员'
    }else if (userright === '2'){
      rightinfo = '领导人员'
    }

    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.setData({
                avatarUrl: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })

    this.setData({
      ['userinfo.username']: username,
      ['userinfo.company']: usercompany,
      ['userinfo.right']: rightinfo,
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