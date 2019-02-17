// miniprogram/pages/loadexamine/loadexamine.js
Page({
  /*
  关于点击的事件响应
  */
  agreeapply:function() {
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
     * 进行确认
     */
    var contenttext = ''
    if (wx.getStorageSync('userright') === '1') {
      contenttext = ' 工作时间为:' + that.data.workdate + ' ' + that.data.worktime + ' 工作地点为:' + that.data.workplace
    }
    wx.showModal({
      title: '确认',
      content: '是否同意该申请?' + contenttext,
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
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
                type: 'orderofload',
                user: wx.getStorageSync('useraccount'),
                state: '1'
              },
              success: res => {
                wx.hideToast()
                const app = getApp()
                app.globalData.loaddeletepage = that.data.pageindex
                if (res.result['ifsuccess']) {
                  wx.showToast({
                    title: '确认成功',
                  })
                  wx.switchTab({
                    url: '../loadpage/load',
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
                          url: '../loadpage/load',
                        })
                      }
                    }
                  })
                  return
                }
              },
              fail:res => {
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
           * 得到时间
           */
          var timedate = that.data.workdate + ' ' + that.data.worktime + ':00'
          /*
          调用云函数来修改审批内容
          */
          wx.cloud.callFunction({
            name: 'completeexamine',
            data: {
              id: that.data.detailinfo['_id'],      //需要审批的订单id
              examinetext: that.data.examineinfo,   //审批意见
              type: 'orderofload',                  //审批类型
              state: '1',                           //审批结果
              time: timedate,                       //工作时间
              place: that.data.workplace,           //工作地点
              user: wx.getStorageSync('useraccount')     //用户账号
            },
            success:res => {
              //console.log(res)
              wx.hideToast()
              const app = getApp()
              app.globalData.loaddeletepage = that.data.pageindex
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '审批成功',
                })
                wx.switchTab({
                  url: '../loadpage/load',
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: res.result['errorinfo'],
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../loadpage/load',
                      })
                    }
                  }
                })
              }
            },
            fail:res => {
              wx.hideToast()
              wx.showToast({
                title: '云端函数出错',
              })
            }
          })
        }
      }
    })
  },
  rejectapply:function() {
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
      content: '是否驳回该申请?',
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
                type: 'orderofload',
                user: wx.getStorageSync('useraccount'),
                state: '101'
              },
              success: res => {
                wx.hideToast()
                const app = getApp()
                app.globalData.loaddeletepage = that.data.pageindex
                if (res.result['ifsuccess']) {
                  wx.showToast({
                    title: '驳回成功',
                  })
                  wx.switchTab({
                    url: '../loadpage/load',
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
                          url: '../loadpage/load',
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

          /*
          调用云函数驳回申请
          */
          wx.cloud.callFunction({
            name: 'completeexamine',
            data: {
              id: that.data.detailinfo['_id'],
              examinetext: that.data.examineinfo,
              type: 'orderofload',
              state: '101',
              time: '1900-01-01 00:00:00',           //工作时间
              place: that.data.workplace,           //工作地点
              user: wx.getStorageSync('useraccount')     //用户账号
            },
            success: res => {
              wx.hideToast()
              const app = getApp()
              app.globalData.loaddeletepage = that.data.pageindex
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '已驳回申请',
                })
                wx.switchTab({
                  url: '../loadpage/load',
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
                        url: '../loadpage/load',
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
        }else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 监听用户输入的审批意见
   */
  updateopinion:function(e) {
    this.setData({
      examineinfo: e.detail.value
    })
  },
  getworkplace:function(e) {
    this.setData({
      workplace: e.detail.value
    })
  },
  /**
   * 监听日期的变动
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
   * 页面的初始数据
   */
  data: {
    loadlist: [
      {
        title: "船舶编号",
        info: "7777777"
      },
      {
        title: "船舶名称",
        info: "super nova 7"
      },
      {
        title: "船舶状态",
        info: "在港"
      },
      {
        title: "航次",
        info: "007"
      },
      {
        title: "提运单号",
        info: "N20180707-007-橘子777"
      },
      {
        title: "装卸类型",
        info: "卸船"
      },
      {
        title: "船代名称",
        info: "湖北海电船务公司"
      },
      {
        title: "到达日期",
        info: "2018/07/07 07:07:07"
      },
      {
        title: "执行合同编号",
        info: "zx20180707127"
      }, 
      {
        title: "签订日期",
        info: "2018/07/07 07:07:07"
      },
      {
        title: "货主名称",
        info: "阿华"
      }, 
      {
        title: "货物规格",
        info: "100kg/箱"
      },
      {
        title: "包装形式",
        info: "箱装"
      },
      {
        title: "件箱数",
        info: "777"
      },
      {
        title: "提交时间",
        info: "2018/07/07 07:07:07"
      }
    ],
    parameterlist: [
      'shipid',
      'cnameename',
      'shipstate',
      'voyagenumber',
      'formsnumber',
      'typeofload',
      'shipagency',
      'arrivaldate',
      'contractid',
      'signdate',
      'goodsowner',
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
      },{
        title: "工作时间",
        info: "无"
      },{
        title: "审批意见",
        info: "无"
      }]
      const supparameterlist = [
        'workplace',
        'worktime',
        'approvaloption'
      ]
      var tloadlist = this.data.loadlist
      var tparameterlist = this.data.parameterlist
      for (var i = 0; i < 3;i++) {
        tloadlist.push(suploadlist[i])
        tparameterlist.push(supparameterlist[i])
      }
      this.setData({
        loadlist: tloadlist,
        parameterlist: tparameterlist
      })
    }
    /**
     * 构建列表
     */
    var getinfo = JSON.parse(options.transfer);
    var i = 0;
    this.setData({
      detailinfo: getinfo,
      pageindex: options.index
    })
    //console.log('当前页面下标为:' + this.data.pageindex)
    for (var item in this.data.loadlist) {
      var index = "loadlist["+i+"].info"
      //console.log(index)
      this.setData({
        [index]: getinfo[this.data.parameterlist[i]]
      })
      //console.log(getinfo[this.data.parameterlist[i]])
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