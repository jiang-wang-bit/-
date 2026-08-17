export interface User{
  id:number;
  username:string;
  email:string;
  role:"管理员"|"普通用户";
  status:"active"|"status";
  create_time:string
}


export interface UserSearchParams{
 username?:string;
 email?:string;
 role?:User["role"];
 status?:User["status"];
}

export interface UserListParams extends UserSearchParams{
  page:number;
  pageSize:number
}