export interface UserInfo{
  id:number
  
 username:string;

 role:"admin"|"user";

 avatar?:string;

 email?:string;

}

export interface LoginParams{

 username:string;

 password:string;

}