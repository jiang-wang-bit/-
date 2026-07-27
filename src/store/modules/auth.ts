import {createSlice} from "@reduxjs/toolkit";
interface UserState{
  token:string,
  userInfo:{
    username:string;
    role:string;
    avatar?:string;
  } | null;
}

const initialState:UserState = {
  token:
  localStorage.getItem("token") || "",
  userInfo:
   JSON.parse(localStorage.getItem("userInfo") || "null") 
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    // 登录
    login(state,action){
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo
      localStorage.setItem("token",action.payload.token);
      localStorage.setItem("userInfo",JSON.stringify(action.payload.userInfo));
     },
  // 退出登录
    logout:(state)=>{
      state.token = "";
      state.userInfo = null;
      localStorage.removeItem(
        "token"
      );
      localStorage.removeItem("userInfo");
    }
}})
// 导出方法
export const {login,logout} = userSlice.actions;
export default userSlice.reducer;