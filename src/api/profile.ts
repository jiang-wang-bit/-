import request from "../request";

// 获取用户信息
export function getProfile(){
  return request.get("/profile")
}

// 修改信息
export function updateProfile(data:any){
  return request.put("/profile",data)
}

// 修改密码
export function updatePassword(data:{
  old_password:string,
  new_password:string
}){
  return request.put("/profile/password",data)
}