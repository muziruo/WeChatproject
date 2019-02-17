// miniprogram/pages/loadpage/load.js
Page({

  /*
  前往审批页面
  */
  gotoexamine:function(e) {
    var index = e.currentTarget.dataset.index
    var transfer = this.data.networkinfo[index];
    //console.log(JSON.stringify(transfer));
    wx.navigateTo({
      url: '../loadexamine/loadexamine?index='+ index +'&transfer='+JSON.stringify(transfer),
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    loadrequestitem: [
      {
        shipid: '7777777',
        cnameename: 'super nova 7',
        shipstate: '在港',
        voyagenumber: '777',
        formsnumber: 'zx20180707127',
        typeofload: '卸船',
        shipagency: '湖北海电船舶有限公司',
        arrivaldate: '2017/07/07 07:07:07',
        contractid: 'zx20180707127',
        signdate: '2018/07/07 07:07:07',
        goodsowner: '阿华',
        goodsform: '箱装',
        packstyle: '箱装',
        counts: '777',
        submittime: '2018/07/07 07:07:07',
      },
      {
        shipid: '1277777',
        cnameename: 'super nova 77',
        shipstate: '在港',
        voyagenumber: '777',
        formsnumber: 'zx20180707127',
        typeofload: '装船',
        shipagency: '湖北海电船舶有限公司',
        arrivaldate: '2017/07/07 07:07:07',
        contractid: 'zx20180707127',
        signdate: '2018/07/07 07:07:07',
        goodsowner: '阿华',
        goodsform: '箱装',
        packstyle: '箱装',
        counts: '777',
        submittime: '2018/07/07 07:07:07',
      },
    ],
    networkinfo:[],
    bottomtext: '上拉加载更多',
    currentcorsur: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 获取待审批项目
     */
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    wx.showToast({
      title: '正在获取数据...',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofload',
        right: userright,
        corsur: -1
      },
      success: res => {
        //console.log(res)
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
      fail: res => {
        wx.hideToast()
        wx.showToast({
          title: '云端函数出错,请稍后重新刷新',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.networkinfo)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const app = getApp()
    if (app.globalData.loaddeletepage !== -1) {
      var networkinfobackup = this.data.networkinfo
      networkinfobackup.splice(app.globalData.loaddeletepage,1)
      this.setData({
        networkinfo: networkinfobackup
      })
    }
    app.globalData.loaddeletepage = -1
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
    /**
     * 获取待审批项目
     */
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofload',
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
            bottomtext: '没有更多数据，请稍后刷新再查看'
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var getinfo = []
    var userright = wx.getStorageSync('userright')
    var nextcorsur = that.data.currentcorsur + 1
    this.setData({
      currentcorsur: nextcorsur
    })
    console.log('下一指针' + this.data.currentcorsur)
    console.log('用户权限：' + userright)
    wx.cloud.callFunction({
      name: 'getloadinfo',
      data: {
        type: 'orderofload',
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})