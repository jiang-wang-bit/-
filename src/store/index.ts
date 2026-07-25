import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./modules/user";

export const store = configureStore({
  reducer: {
    user: userReducer
  }
});

// 获取仓库全部状态的类型
export type RootState = ReturnType<typeof store.getState>

// 获取 dispatch 的完整类型
export type AppDispatch = typeof store.dispatch