// miniprogram/pages/registerpage/register.js
Page({
  /**
   * 登记操作
   */
  finished: function() {
    var that = this
    if (that.data.completion === '') {
      that.setData({
        completion: '无'
      })
    }
    wx.showModal({
      title: '提示',
      content: '确认要进行登记,确保工作已经完成',
      showCancel: true,
      cancelText: '取消',
      confirmText: '登记',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在写入数据...',
            icon: 'loading'
          })
          //console.log('id为：'+ that.data.infolist['_id'])
          /**
           * 调用云函数来进行登记操作
           */
          wx.cloud.callFunction({
            name: 'completeregister',
            data: {
              type: that.data.ordertype,
              user: wx.getStorageSync('useraccount'),
              id: that.data.transferinfo['_id'],
              text: that.data.completion,
              state: '3'
            },
            success: res => {
              wx.hideToast()
              console.log(res)
              const app = getApp()
              app.globalData.searchdeletepage = 0
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '登记成功',
                })
                wx.navigateBack({
                  delta: 1
                })
              }else {
                wx.showModal({
                  title: '提示',
                  content: res.result['errorinfo'],
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
            },
            fail: res => {
              wx.hideToast()
              wx.showToast({
                title: '云端函数调用失败,可尝试重试',
              })
            }
          })
        }else if (res.cancel) {

        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  unfinished: function() {
    var that = this
    if (that.data.completion === '') {
      that.setData({
        completion: '无'
      })
    }
    wx.showModal({
      title: '提示',
      content: '确认要进行登记?请检查未完成原因是否填写完整',
      showCancel: true,
      cancelText: '取消',
      confirmText: '登记',
      cancelColor: '#f3112a',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在写入数据...',
            icon: 'loading'
          })
          /**
           * 调用云函数修改
           */
          wx.cloud.callFunction({
            name: 'completeregister',
            data: {
              type: that.data.ordertype,
              user: wx.getStorageSync('useraccount'),
              id: that.data.transferinfo['_id'],
              text: that.data.completion,
              state: '303'
            },
            success: res => {
              wx.hideToast()
              const app = getApp()
              app.globalData.searchdeletepage = 0
              if (res.result['ifsuccess']) {
                wx.showToast({
                  title: '登记成功',
                })
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.result['errorinfo'],
                  confirmText: '确认',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  }
                })
              }
            },
            fail: res => {
              wx.hideToast()
              wx.showToast({
                title: '云端函数调用失败,可尝试重试',
              })
            }
          })
        }else if (res.cancel) {

        }
      }
    })
  },
  gettext: function(e) {
    this.setData({
      completion: e.detail.value
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    infolistofload: [{
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
      }],
    infolistofdeliver: [{
      title: '执行合同编号',
      info: 'ys2018007'
      }, {
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
      }],
    parameterlistofload: [
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
    parameterlistofdeliver: [
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
    infolist: [],
    parameterlist: [],
    ordertype: '0',
    disable: true,
    tipinfo: '',
    completion: '无',
    tipfinished: '',
    transferinfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var getinfo = JSON.parse(options.transferinfo)
    that.setData({
      transferinfo: getinfo
    })
    /**
     * 根据订单类型来建立渲染数据
     */
    if (options.type === '1') {
      /**
       * 装卸审批
       */
      that.setData({
        ordertype: 'orderofload'
      })
      /**
       * 首先查看该订单是否已经登记
       */
      if (getinfo['approvalstate'] === '3' || getinfo['approvalstate'] === '303') {
        var tinfolist = that.data.infolistofload
        var tparameterlist = that.data.parameterlistofload
        var suploadlist = []
        if (getinfo['approvalstate'] === '3') {
          suploadlist = [{
            title: "工作地点",
            info: "无"
          }, {
            title: "工作时间",
            info: "无"
          }, {
            title: "审批意见",
            info: "无"
          },{
            title: "完成情况",
            info: '无'
          }]
          that.setData({
            tipinfo: '',
            tipfinished: '本次订单已完成'
          })
        }else {
          suploadlist = [{
            title: "工作地点",
            info: "无"
          }, {
            title: "工作时间",
            info: "无"
          }, {
            title: "审批意见",
            info: "无"
          }, {
            title: "未完成原因",
            info: '无'
          }]
          that.setData({
            tipinfo: '本次的订单未完成',
            tipfinished: ''
          })
        }
        const supparameterlist = [
          'workplace',
          'worktime',
          'approvaloption',
          'completestate'
        ]
        for (var i=0; i < 4; i++) {
          tinfolist.push(suploadlist[i])
          tparameterlist.push(supparameterlist[i])
        }
        /**
         * 组装渲染数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist
        })
        return
      }

      /**
       * 如果未完成登记
       */
      if (getinfo['approvalstate'] === '1') {
        /**
        * 该订单已经被审批通过,需要添加审批的结果
        */
        var tinfolist = that.data.infolistofload
        var tparameterlist = that.data.parameterlistofload
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
        for (var i = 0; i < 3; i++) {
          tinfolist.push(suploadlist[i])
          tparameterlist.push(supparameterlist[i])
        }
        /**
         * 组装渲染数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist
        })

        if (getinfo['leaderaffirm'] === '1') {
          /**
           * 该订单已被领导确认通过
           */
          that.setData({
            disable: false,
            tipfinished: ''
          })
        }else if (getinfo['leaderaffirm'] === '101') {
          /**
           * 该订单被领导驳回
           */
          that.setData({
            tipinfo: '该订单已被领导驳回，无法进行完成登记',
            disable: true,
            tipfinished: ''
          })
        }else if (getinfo['leaderaffirm'] === '0') {
          /**
           * 该订单领导尚未确认
           */
          that.setData({
            tipinfo: '该订单领导尚未确认，无法进行完成登记',
            disable: true,
            tipfinished: ''
          })
        }
      }else if (getinfo['approvalstate'] === '101') {
        /**
         * 该订单初审被驳回
         */
        var tinfolist = that.data.infolistofload
        var tparameterlist = that.data.parameterlistofload
        const suploadlist = [{
          title: "审批意见",
          info: "无"
        }]
        const supparameterlist = [
          'approvaloption'
        ]
        tinfolist.push(suploadlist[0])
        tparameterlist.push(supparameterlist[0])
        /**
         * 组装数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist,
          tipinfo: '该订单审批被驳回,无法进行完成登记',
          disable: true,
          tipfinished: ''
        })
      }else if (getinfo['approvalstate'] === '0') {
        /**
         * 该订单尚未被审批
         */
        var tinfolist = that.data.infolistofload
        var tparameterlist = that.data.parameterlistofload
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist,
          tipinfo: '该订单尚未被审批,无法进行完成登记',
          disable: true,
          tipfinished: ''
        })
      }
    }else if (options.type === '2') {
      /**
       * 发货审批
       */
      that.setData({
        ordertype: 'orderofdeliver'
      })
      /**
       * 首先查看该订单是否已经登记
       */
      if (getinfo['approvalstate'] === '3' || getinfo['approvalstate'] === '303') {
        var tinfolist = that.data.infolistofdeliver
        var tparameterlist = that.data.parameterlistofdeliver
        var suploadlist = []
        if (getinfo['approvalstate'] === '3') {
          suploadlist = [{
            title: "工作地点",
            info: "无"
          }, {
            title: "工作时间",
            info: "无"
          }, {
            title: "审批意见",
            info: "无"
          }, {
            title: "完成情况",
            info: '无'
          }]
          that.setData({
            tipinfo: '',
            tipfinished: '本次订单已完成'
          })
        } else {
          suploadlist = [{
            title: "工作地点",
            info: "无"
          }, {
            title: "工作时间",
            info: "无"
          }, {
            title: "审批意见",
            info: "无"
          }, {
            title: "未完成原因",
            info: '无'
          }]
          that.setData({
            tipinfo: '本次的订单未完成',
            tipfinished: ''
          })
        }
        const supparameterlist = [
          'workplace',
          'worktime',
          'approvaloption',
          'completestate'
        ]
        for (var i = 0; i < 4; i++) {
          tinfolist.push(suploadlist[i])
          tparameterlist.push(supparameterlist[i])
        }
        /**
         * 组装渲染数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist
        })
        return
      }

      /**
       * 如果未完成登记
       */
      if (getinfo['approvalstate'] === '1') {
        /**
         * 该订单初审通过,添加审批结果
         */
        var tinfolist = that.data.infolistofdeliver
        var tparameterlist = that.data.parameterlistofdeliver
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
        for (var i = 0; i < 3; i++) {
          tinfolist.push(suploadlist[i])
          tparameterlist.push(supparameterlist[i])
        }
        /**
         * 组装渲染数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist
        })

        if (getinfo['leaderaffirm'] === '1') {
          /**
           * 该订单领导确认通过
           */
          that.setData({
            disable: false,
            tipfinished: ''
          })
        }else if (getinfo['leaderaffirm'] === '101') {
          /**
           * 该订单初审通过但被领导驳回
           */
          that.setData({
            tipinfo: '该订单已被领导驳回，无法进行完成登记',
            disable: true,
            tipfinished: ''
          })
        }else if (getinfo['leaderaffirm'] === '0') {
          /**
           * 该订单初审通过但尚未被领导确认
           */
          that.setData({
            tipinfo: '该订单尚未被领导确认，无法进行完成登记',
            disable: true,
            tipfinished: ''
          })
        }
      }else if (getinfo['approvalstate'] === '101') {
        /**
         * 该订单初审被驳回
         */
        var tinfolist = that.data.infolistofdeliver
        var tparameterlist = that.data.parameterlistofdeliver
        const suploadlist = [{
          title: "审批意见",
          info: "无"
        }]
        const supparameterlist = [
          'approvaloption'
        ]
        tinfolist.push(suploadlist[0])
        tparameterlist.push(supparameterlist[0])
        /**
         * 组装数据
         */
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }

        that.setData({
          infolist: tinfolist,
          disable: true,
          tipinfo: '该订单审批被驳回,无法进行完成登记',
          tipfinished: ''
        })
      }else if (getinfo['approvalstate'] === '0') {
        /**
         * 该订单尚未被审批
         */
        var tinfolist = that.data.infolistofdeliver
        var tparameterlist = that.data.parameterlistofdeliver
        var index = 0
        for (var item in tinfolist) {
          tinfolist[index].info = getinfo[tparameterlist[index]]
          index++
        }
        that.setData({
          infolist: tinfolist,
          tipinfo: '该订单尚未被审批,无法进行完成登记',
          disable: true,
          tipfinished: ''
        })
      }
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