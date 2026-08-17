import request from "../request";
import type { LoginParams } from "../types/auth";

// 登录
export function loginApi(data:LoginParams){
  return request.post("/auth/login",data)
}

// 注册
export function registerApi(data:{
  username:string
  password:string
  email:string
}){
  return request.post("/auth/register",data)
}