// miniprogram/pages/completeregister/completeregister.js
Page({

  getnumber:function(e) {
    this.setData({
      ordernumber: e.detail.value
    })
  },
  /**
   * 查找订单
   */
  searchorder:function() {
    var that = this
    var getinfo = []
    if (that.data.ordernumber === '') {
      wx.showToast({
        title: '请输入编号',
        icon: 'none'
      })
    }else{
      wx.showToast({
        title: '正在搜索...',
        icon: 'loading'
      })
      wx.cloud.callFunction({
        name: 'searchorder',
        data: {
          id: that.data.ordernumber
        },
        success: res => {
          wx.hideToast()
          if (res.result.ifsuccess) {
            getinfo.push(res.result.errorinfo.data[0])
            if (res.result.infosource === '1') {
              that.setData({
                orderlist: getinfo,
                info1: getinfo[0].cnameename,
                info2: getinfo[0].shipagency,
                info3: getinfo[0].goodsowner,
                ordertype: res.result.infosource,
                tiptext: '以上为查询结果'
              })
            }else {
              that.setData({
                orderlist: getinfo,
                info1: getinfo[0].company,
                info2: getinfo[0].shipagency,
                info3: getinfo[0].consigner,
                ordertype: res.result.infosource,
                tiptext: '以上为查询结果'
              })
            }
          }else {
            that.setData({
              orderlist: [],
              tiptext: '当前无信息,请输入编号进行查询确认'
            })
            wx.showToast({
              title: res.result.errorinfo,
              icon: 'none'
            })
          }
        },
        fail:res => {
          wx.hideToast()
          wx.showToast({
            title: '云端函数出错,请稍后重试',
          })
        }
      })
    }
  },
  gotregister:function() {
    var transferinfo = JSON.stringify(this.data.orderlist[0])
    wx.navigateTo({
      url: '../registerpage/register?type=' + this.data.ordertype + '&transferinfo=' + transferinfo,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    ordernumber: '',
    orderlist: [],
    info1: '',
    info2: '',
    info3: '',
    tiptext: '当前无信息,请输入编号进行查询确认',
    ordertype: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const app = getApp()
    if (app.globalData.searchdeletepage !== -1) {
      var torderlist = []
      //torderlist.splice(app.globalData.searchdeletepage ,1)
      this.setData({
        orderlist: torderlist
      })
      app.globalData.searchdeletepage = -1
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