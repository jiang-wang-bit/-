export interface UserInfo{
  id:number
 username:string;

 role:string;

 avatar?:string;

 email?:string;

}

export interface LoginParams{

 username:string;

 password:string;

}