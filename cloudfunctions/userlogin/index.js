// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const userlist = db.collection('users')

  /*
  检查该账号是否存在
  */
  const info = await userlist.where({ 'userid': event.account }).get({})

  if (JSON.stringify(info.data) === '[]') {
    return {
      ifsuccess: false,
      errorinfo: '账号不存在'
    }
  }

  /*
  检查密码是否正确
  */
  if (info.data[0]['password'] === event.password) {
    return {
      ifsuccess: true,
      errorinfo: info.data[0]
    }
  }else {
    return {
      ifsuccess: false,
      errorinfo: '密码不正确'
    }
  }
  
}