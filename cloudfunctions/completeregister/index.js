// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const registerinfo = db.collection(event.type)
  const flowinfo = db.collection('examineflow')
  const users = db.collection('users')

  var ifexamine = true
  /**
   * 检查该用户是否存在
   */
  const right = await users.where({ 'userid': event.user }).get({})
  if (JSON.stringify(right.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '当前用户不存在,无法完成登记'
    }
  }
  if (right.data[0]['right'] !== '2' && right.data[0]['right'] !== '1') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '越权操作，您没有确认权限'
    }
  }
  //保存用户的id
  var userid = right.data[0]['userid']

  /*
  首先查看一下当前表中是否还有该条记录，如果有继续操作，如果没有，返回该订单已经被审批
  */
  const info = await registerinfo.where({ '_id': event.id }).get({})
  if (JSON.stringify(info.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '您所登记的订单不存在'
    }
  }
  if (info.data[0]['approvalstate'] === '3' || info.data[0]['approvalstate'] === '303') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '该订单已被其他人员完成登记'
    }
  }
  var orderid = ''
  if (event.type === 'orderofload') {
    orderid = info.data[0]['formsnumber']
  } else if (event.type === 'orderofdeliver') {
    orderid = info.data[0]['contractid']
  } else {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '未找到订单类型'
    }
  }

  const getflow = await flowinfo.where({ 'formnumber': orderid }).get({})
  if (JSON.stringify(getflow.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '该订单审批流程表不存在'
    }
  }

  /**
   * 完成登记信息写入，修改状态位
   */
  const orderresult = await registerinfo.doc(event.id).update({
    data: {
      approvalstate: event.state,
      completestate: event.text
    }
  })

  const flowresult = await flowinfo.where({ 'formnumber': orderid }).update({
    data: {
      registerid: userid,
      state: event.state
    }
  })

  /**
   * 返回最终确认结果
   */
  return {
    ifsuccess: ifexamine,
    oresult: orderresult,
    fresult: flowresult
  }
}