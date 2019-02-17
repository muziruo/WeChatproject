// miniprogram/pages/loginpage/login.js
Page({

  userlogin: function(e) {
    var func_md5 = require('../../until/md5.js')
    var that = this
    if (that.data.accountinfo === '' || that.data.passwordinfo === '') {
      wx.showToast({
        title: '请输入完整的账号和密码',
        icon: 'none'
      })
    }else{
      var encrypt = func_md5.md5(that.data.passwordinfo)
      wx.showToast({
        title: '正在登录...',
        icon: 'loading'
      })

      wx.cloud.callFunction({
        name: 'userlogin',
        data: {
          account: that.data.accountinfo,
          password: encrypt
        },
        success: res => {
          if (res.result['ifsuccess']) {
            /**
            * 将用户的账号信息进行存储
            */
            try {
              wx.setStorageSync('useraccount', res.result['errorinfo']['userid'])
              wx.setStorageSync('username', res.result['errorinfo']['username'])
              wx.setStorageSync('userpassword', that.data.passwordinfo)
              wx.setStorageSync('usercompany', res.result['errorinfo']['company'])
              wx.setStorageSync('userright', res.result['errorinfo']['right'])
            } catch (e) {

            }
            if(res.result['errorinfo']['right'] === '2') {
              const app = getApp()
              app.globalData.ifAdtor = false
            }
            console.log(res.result['errorinfo']['username'])
            wx.showToast({
              title: '登录成功',
            })

            wx.hideToast()

            wx.switchTab({
              url: '../index/index',
            })
          } else {
            wx.hideToast()
            wx.showToast({
              title: res.result['errorinfo'],
              icon: 'none'
            })
          }
          
        },
        fail: res => {
          wx.hideToast()
          wx.showToast({
            title: '云端函数出错，请稍后重试',
            icon: 'none'
          })
        }
      })
    }
  },

  getaccount:function(e) {
    this.setData({
      accountinfo: e.detail.value
    })
  },

  getpassword:function(e) {
    this.setData({
      passwordinfo: e.detail.value
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    accountinfo:'',
    passwordinfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var useraccount = wx.getStorageSync('useraccount')
    var userpassword = wx.getStorageSync('userpassword')
    if (useraccount != ''&& userpassword != ''){
      this.setData({
        accountinfo: useraccount,
        passwordinfo: userpassword
      })
    }
    const app = getApp()
    console.log('全局变量：' + app.globalData.loaddeletepage)
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
    if (this.data.accountinfo != ''&& this.data.passwordinfo != ''){
      this.userlogin()
    }
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