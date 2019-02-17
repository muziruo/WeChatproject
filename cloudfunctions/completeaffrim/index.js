// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const completeaffrim = db.collection(event.type)
  const users = db.collection('users')
  const flow = db.collection('examineflow')
  var ifexamine = true

  /**
   * 检查该用户是否具有确认权限
   */
  const right = await users.where({ 'userid': event.user }).get({})
  if (JSON.stringify(right.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '当前用户不存在'
    }
  }
  if (right.data[0]['right'] !== '2') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '越权操作，您没有确认权限'
    }
  }
  var userid = right.data[0]['userid']

  /*
  首先查看一下当前表中是否还有该条记录，如果有继续操作，如果没有，返回该订单已经被审批
  */
  const info = await completeaffrim.where({ '_id': event.id }).get({})
  if (JSON.stringify(info.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '您所确认的订单不存在'
    }
  }
  if (info.data[0]['leaderaffirm'] !== '0') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '该订单已被其他人员确认'
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

  const getflow = await flow.where({ 'formnumber': orderid }).get({})
  if (JSON.stringify(getflow.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '该订单审批流程表不存在'
    }
  }

  /**
   * 领导确认信息写入，修改领导确认位
   */
  const orderresult = await completeaffrim.doc(event.id).update({
    data: {
      leaderaffirm: event.state
    }
  })

  const flowresult = await flow.where({ 'formnumber': orderid }).update({
    data: {
      leaderprocessid: userid,
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