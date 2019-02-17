// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var examinetype = event.type
  try {
    return await db.collection(examinetype).where({
      _id: event.id
    })
      .update({
        data: {
          approvaloption: event.examinetext,
          approvalstate: event.state
        },
      })
  } catch (e) {
    console.error(e)
  }
}