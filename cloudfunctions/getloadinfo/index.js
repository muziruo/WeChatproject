// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 10

// 云函数入口函数
exports.main = async (event, context) => {
  /*
  先看看数据库中有多少条数据
  */
  var result = {}
  var corsur = event.corsur
  
  if (event.right === '1') {
    lujing = 1
    result = await db.collection(event.type).where({ approvalstate: '0' }).count()
  }else {
    lujing = 2
    result = await db.collection(event.type).where({ approvalstate: '1', leaderaffirm: '0' }).count()
  }
  const total = result.total
  var batchtimes = 0
  if (total !== 0){
    batchtimes = Math.ceil(total / 10) - 1
  }
  var thispage = Math.round(Math.random()*batchtimes)

  //如果没有指定指针，则使用随机指针
  if (corsur !== -1) {
    thispage = corsur
  }
  var info = {}
  if (event.right === '1') {
    info = await db.collection(event.type).where({ approvalstate: '0' }).skip(thispage * MAX_LIMIT).limit(MAX_LIMIT).get()
  }else {
    info = await db.collection(event.type).where({ approvalstate: '1', leaderaffirm: '0' }).skip(thispage * MAX_LIMIT).limit(MAX_LIMIT).get()
  }
  
  return {
    totalnumber: total,
    corsur: thispage,
    datalist: info,
  }
}