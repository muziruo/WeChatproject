// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const searchfromload = db.collection('orderofload')
  const searchfromdeliver = db.collection('orderofdeliver')

  const loadresult = await searchfromload.where({ formsnumber: event.id }).get()
  if (JSON.stringify(loadresult.data) !== '[]') {
    return {
      ifsuccess: true,
      errorinfo: loadresult,
      infosource: '1'
    }
  }

  const deliverresult = await searchfromdeliver.where({ contractid: event.id }).get()
  if (JSON.stringify(deliverresult.data) !== '[]') {
    return {
      ifsuccess: true,
      errorinfo: deliverresult,
      infosource: '2'
    }
  }

  return {
    ifsuccess: false,
    errorinfo: '未找到你所搜索的订单',
    infosource: '0'
  }
}