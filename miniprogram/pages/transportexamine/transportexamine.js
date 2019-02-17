// miniprogram/pages/transportexamine/transportexamine.js
Page({
  /**
   * 同意或者驳回订单
   */
  agreetransport:function() {
    var that = this
    /**
     * 首先检查工作地点和审批意见是否为空，防止后台出现错误，后台也做了相应的判断
     */
    if (that.data.workplace === '') {
      that.setData({
        workplace: '未指定'
      })
    }
    if (that.data.examineinfo === '') {
      that.setData({
        examineinfo: '无'
      })
    }
    /**
     * 确认审批
     */
    var contenttext = ''
    if (wx.getStorageSync('userright') === '1') {
      contenttext = ' 工作时间为:' + that.data.workdate + ' ' + that.data.worktime + ' 工作地点为:' + that.data.workplace
    }
    wx.showModal({
      title: '确认',
      content: '是否同意该请求?' + contenttext,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '写入数据...',
            icon: 'loading'
          })
          /**
           * 根据登录角色的不同来执行不同的操作
           */
          if (wx.getStorageSync('userright') === '2') {
            wx.cloud.callFunction({
              name: 'completeaffrim',
              data: {
                id: that.data.detailinfo['_id'],
                type: 'orderofdeliver',
                user: wx.getStorageSync('useraccount'),
                state: '1'
              },
              success: res => {
                wx.hideToast()
                const app = getApp()
                app.globalData.deliverdeletepage = that.data.pageindex
                if (res.result['ifsuccess']) {
                  wx.showToast({
                    title: '确认成功',
                  })
                  wx.switchTab({
                    url: '../index/index',
                  })
                  return
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.result['errorinfo'],
                    confirmText: '确认',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        return
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    }
                  })
                  return
                }
              },
              fail: res => {
                wx.hideToast()
                wx.showToast({
                  title: '云端函数出错',
                })
                return
              }
            })
          }

          if (wx.getStorageSync('userright') === '2') {
            return
          }

          /**
           * 时间字符串
           */
          var timedate = that.data.workdate + ' ' + that.data.worktime + ':00'
          /*
          调用云函数修改审核信息
          */
          wx.cloud.callFunction({
            name: 'completeexamine',
            data: {
              id: that.data.detailinfo['_id'],      //需要审批的订单id
              examinetext: that.data.examineinfo,   //审批意见
              type: 'orderofdeliver',               //审批类型
              state: '1',                           //审批结果
              time: timedate,                       //工作时间
              place: that.data.workplace,           //工作地点
              user: wx.getStorageSync('useraccount')     //用户账号
            },
            success: res => {
              wx.hideToast()
              const app = getApp()
              app.globalData.deliverdeletepage = that.data.pageindex
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '审批成功',
                })
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.result['errorinfo'],
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
            },
            fail: res => {
              wx.hideToast()
              wx.showToast({
                title: '云端函数出错',
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  rejecttransport:function() {
    var that = this
    /**
     * 首先检查工作地点和审批意见是否为空，防止后台出现错误，后台也做了相应的判断
     */
    if (that.data.workplace === '') {
      that.setData({
        workplace: '未指定'
      })
    }
    if (that.data.examineinfo === '') {
      that.setData({
        examineinfo: '无'
      })
    }
    /**
     * 确认驳回
     */
    wx.showModal({
      title: '确认',
      content: '是否驳回该请求?',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: '#f3112a',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在写入数据...',
            icon: 'loading'
          })
          /**
           * 根据登录角色的不同来执行不同的操作
           */
          if (wx.getStorageSync('userright') === '2') {
            wx.cloud.callFunction({
              name: 'completeaffrim',
              data: {
                id: that.data.detailinfo['_id'],
                type: 'orderofdeliver',
                user: wx.getStorageSync('useraccount'),
                state: '101'
              },
              success: res => {
                wx.hideToast()
                const app = getApp()
                app.globalData.deliverdeletepage = that.data.pageindex
                if (res.result['ifsuccess']) {
                  wx.showToast({
                    title: '驳回成功',
                  })
                  wx.switchTab({
                    url: '../index/index',
                  })
                  return
                } else {
                  wx.showModal({
                    title: '提示',
                    content: res.result['errorinfo'],
                    confirmText: '确认',
                    showCancel: false,
                    success(res) {
                      if (res.confirm) {
                        return
                        wx.switchTab({
                          url: '../index/index',
                        })
                      }
                    }
                  })
                  return
                }
              },
              fail: res => {
                wx.hideToast()
                wx.showToast({
                  title: '云端函数出错',
                })
                return
              }
            })
          }

          if (wx.getStorageSync('userright') === '2') {
            return
          }

          /**
           * 调用云函数进行审批
           */
          wx.cloud.callFunction({
            name: 'completeexamine',
            data: {
              id: that.data.detailinfo['_id'],
              examinetext: that.data.examineinfo,
              type: 'orderofdeliver',
              state: '101',
              time: '1900-01-01 00:00:00',           //工作时间
              place: that.data.workplace,           //工作地点
              user: wx.getStorageSync('useraccount')     //用户账号
            },
            success: res => {
              wx.hideToast()
              const app = getApp()
              app.globalData.deliverdeletepage = that.data.pageindex
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '已驳回申请',
                })
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.result['errorinfo'],
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../index/index',
                      })
                    }
                  }
                })
              }
            },
            fail: res => {
              wx.hideToast()
              wx.showToast({
                title: '云端函数出错',
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 审批意见
   */
  updateexaminetext:function(e) {
    this.setData({
      examineinfo: e.detail.value
    })
  },
  /**
   * 时间改变
   */
  datechange:function(e) {
    this.setData({
      workdate: e.detail.value
    })
  },
  timechange:function(e) {
    this.setData({
      worktime: e.detail.value
    })
  },
  /**
   * 工作地点改变
   */
  getworkplace: function(e) {
    this.setData({
      workplace: e.detail.value
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    listinfo: [
      {
        title: '执行合同编号',
        info: 'ys2018007'
      },{
        title: '购货单位',
        info: '武汉理工大学'
      }, {
        title: '发货日期',
        info: '2018/07/07 07:07:07'
      }, {
        title: '货物名称',
        info: '橘子'
      }, {
        title: '船代名称',
        info: '湖北海电船舶有限公司'
      }, {
        title: '发货人',
        info: '阿华'
      }, {
        title: '发货人联系方式',
        info: '7777777'
      }, {
        title: '货物规格',
        info: '100kg/箱'
      }, {
        title: '包装形式',
        info: '箱装'
      }, {
        title: '件箱数',
        info: '777'
      }, {
        title: '提交时间',
        info: '2018/07/07 07:07:07'
      }
    ],
    parameterlist: [
      'contractid',
      'company',
      'deliverdate',
      'goods',
      'shipagency',
      'consigner',
      'consignertel',
      'goodsform',
      'packstyle',
      'counts',
      'submittime'
    ],
    detailinfo: [],
    examineinfo: '无',
    workdate: '2018-10-07',
    worktime: '12:30',
    workplace: '未指定',
    pageindex: -1,
    isAdtor: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 渲染条件
     */
    const app = getApp()
    this.setData({
      isAdtor: app.globalData.ifAdtor
    })

    if (!this.data.isAdtor) {
      const suploadlist = [{
        title: "工作地点",
        info: "无"
      }, {
        title: "工作时间",
        info: "无"
      }, {
        title: "审批意见",
        info: "无"
      }]
      const supparameterlist = [
        'workplace',
        'worktime',
        'approvaloption'
      ]
      var tloadlist = this.data.listinfo
      var tparameterlist = this.data.parameterlist
      for (var i = 0; i < 3; i++) {
        tloadlist.push(suploadlist[i])
        tparameterlist.push(supparameterlist[i])
      }
      this.setData({
        listinfo: tloadlist,
        parameterlist: tparameterlist
      })
    }

    var getinfo = JSON.parse(options.transferinfo)
    this.setData({
      detailinfo: getinfo,
      pageindex: options.index
    })
    //console.log(this.data.detailinfo)
    var i = 0
    for (var item in this.data.parameterlist) {
      var index = "listinfo[" + i + "].info"
      this.setData({
        [index]:getinfo[this.data.parameterlist[i]]
      })
      i++
    }
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