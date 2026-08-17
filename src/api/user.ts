import { getStorage,setStorage } from "../utils/storage";
import type {User,UserSearchParams,UserListParams} from "../types/user"
import router from "../router";
import request from "../request";
const STORAGE_KEY = "userList"
// 获取用户列表
export function getUserList(params:UserListParams){
  let users = getStorage<User[]>(STORAGE_KEY)
  if(params.username){
    users = users.filter(item=>item.username.includes(params.username!))
  }
  if(params.role){
    users = users.filter(item=>item.role===params.role)
  }
  // 总数量
  const total = users.length
  // 分页计算
  const start = (params.page-1)*params.pageSize
  const list = users.slice(start,start+params.pageSize)
  return Promise.resolve({list,total})
}

// 新增用户
export function createUser(data:{username:string;
  email:string;
  role:User["role"];
  status:User["status"]
}){
   const users = getStorage<User[]>(STORAGE_KEY)
   const newUser:User={
    id:Date.now(),
    username:data.username,
    email:data.email,
    role:data.role,
    status:data.status,
    create_time:new Date().toLocaleDateString()
   }
   users.push(newUser)
   setStorage(STORAGE_KEY,users)
   return Promise.resolve(newUser)
}

// 删除用户
export function deleteUser(id:number){
   const users = getStorage<User[]>(STORAGE_KEY)
   const newUsers = users.filter(item=>item.id!==id)
   setStorage(STORAGE_KEY,newUsers)
   return Promise.resolve(true)
}

// 获取用户详情
export function getUserDetail(id:number){
  const users = getStorage<User[]>(STORAGE_KEY)
  const user = users.find(item=>item.id===id)
  return Promise.resolve(user)
}

// 修改用户
export function updateUser(id:number,data:{
  username:string;
  email:string;
  role:User["role"];
  status:User["status"];
}){
   const users = getStorage<User[]>(STORAGE_KEY)
   const index = users.findIndex(item=>item.id ===id )
   if(index!==-1){
    users[index] = {
      ...users[index],
      ...data
    }
   }
   setStorage(STORAGE_KEY,users)
   return Promise.resolve(users[index])
  }

// 获取用户点赞文章
export function getUserLikes(){
  return request.get(
 `/user/likes`)
}