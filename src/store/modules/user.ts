import {createSlice} from "@reduxjs/toolkit";
interface UserState{
  token:string
}

const initialState:UserState = {
  token:
  localStorage.getItem("token") || ""
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    // 登录
    login(state,action){
      state.token = action.payload;
      localStorage.setItem("token",action.payload);
     },
  // 退出登录
    logout:(state)=>{
      state.token = "";
      localStorage.removeItem(
        "token"
      );
    }
}})
// 导出方法
export const {login,logout} = userSlice.actions;
export default userSlice.reducer;