// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const completeexamine = db.collection(event.type)
  const users = db.collection('users')
  const flow = db.collection('examineflow')
  var ifexamine = true

  /**
   * 检查该用户是否具有审批权限
   */
  const right = await users.where({ 'userid': event.user }).get({})
  if (JSON.stringify(right.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '当前用户不存在'
    }
  }
  if (right.data[0]['right'] !== '1') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '越权操作，您没有审批权限'
    }
  }
  var userid = right.data[0]['userid']

  /*
  首先查看一下当前表中是否还有该条记录，如果有继续操作，如果没有，返回该订单已经被审批
  */
  const info = await completeexamine.where({'_id':event.id}).get({})
  if (JSON.stringify(info.data) === '[]') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '您所审批的订单不存在'
    }
  }
  if (info.data[0]['approvalstate'] !== '0') {
    ifexamine = false
    return {
      ifsuccess: ifexamine,
      errorinfo: '该订单已被其他人员审批'
    }
  }
  var orderid = ''
  if (event.type === 'orderofload') {
    orderid = info.data[0]['formsnumber']
  }else if (event.type === 'orderofdeliver') {
    orderid = info.data[0]['contractid']
  }else{
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
   * 需要后台修改的内容有，订单中的审批状态、审批意见、工作地点、工作时间，以及审批流程表中的审批人和确认人
   */
  const timedate = new Date(event.time)
  const orderresult = await completeexamine.doc(event.id).update({
    data: {
      approvalstate: event.state,
      approvaloption: event.examinetext,
      workplace: event.place,
      worktime: timedate
    }
  })

  const flowresult = await flow.where({ 'formnumber': orderid }).update({
    data: {
      processid: userid,
      processmsg: event.examinetext,
      state: event.state
    }
  })

  /**
   * 返回最终审批结果
   */
  return {
    ifsuccess: ifexamine,
    oresult: orderresult,
    fresult: flowresult
  }
}