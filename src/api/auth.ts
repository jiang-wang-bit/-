import type { LoginParams } from "../types/auth"
export function loginApi(data:LoginParams){
  if(data.username==="admin"&&data.password==="123456"){
    return Promise.resolve({
      token:"blog-token-123",
      userInfo:{
        id:1,
        username:"admin",
        role:"管理员",
        avatar:""
      }
    })
  }
  return Promise.reject("账号密码错误")
}