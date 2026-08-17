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