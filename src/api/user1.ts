import { ExperimentFilled } from "@ant-design/icons";
import request from "../request";

// 获取用户列表
export function getUserList(params:any){
  return request.get("/users",{
    params
  })
}

// 添加用户
export function addUser(data:{
  username:string,
  email:string,
  password:string,
  role:string,
  status:string
}){
  return request.post("/users",data)
}

// 删除用户
export function deleteUser(id:number){
  return request.delete(`/users/${id}`)
}

// 彻底删除用户
export function deleteUserPermanently(id:number){
  return request.delete(`/users/${id}/permanent`)
}
// 恢复用户
export function restoreUser(id:number){
  return request.put(`/users/${id}/restore`)
}

// 获取回收站用户
export function getTrashUsers(){
  return request.get("/users/trash")
}

// 获取用户详情
export function getUserDetail(id:number){
  return request.get(`/users/${id}`)
}

// 修改用户
export function updateUser(id:number,data:any){
  return request.put(`/users/${id}`,data)
}

// 新增用户
export function createUser(data:any){
  return request.post("/users",data)
}

// 禁用用户
export function disableUser(id:number){
  return request.put(`/users/${id}/disable`)
}

// 批量禁用用户
export function batchDisableUser(ids:number[]){
  return request.put("/users/batch_disable",
    {
      ids
    }
  )
}

// 启用用户
export function enableUser(id:number){
  return request.put(`/users/${id}/enable`)
}

// 批量启用
export function batchEnableUser(ids:number[]){
  return request.put("/users/batch_enable",
   {
    ids
   }
  )
}

// 批量进入回收站
export function batchDeteleUser(ids:number[]){
  return request.put("/users/batch_deleted",
    {
      ids
    }
  )
}

// 批量恢复
export function batchRestoreUser(ids:number[]){
  return request.put("/users/batch_restore",
    {
      ids
    }
  )
}

// 批量永久删除
export function batchDeletePermanent(ids:number[]){
  return request.delete("/user/batch_permannet",{
    data:{
      ids
    }
  })
}

// 重置密码
export function resetPassword(id:number){
  return request.put(`/users/${id}/reset_password`)
}