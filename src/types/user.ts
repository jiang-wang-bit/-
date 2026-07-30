export interface User{
  id:number;
  username:string;
  email:string;
  role:"管理员"|"普通用户";
  status:"正常"|"禁用";
  createTime:string
}