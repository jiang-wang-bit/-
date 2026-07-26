import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./modules/user";
import Article from "../pages/Article";
import articleReducer from "./modules/article"
export const store = configureStore({
  reducer: {
    user: userReducer,
    article:articleReducer
  }
});

// 获取仓库全部状态的类型
export type RootState = ReturnType<typeof store.getState>

// 获取 dispatch 的完整类型
export type AppDispatch = typeof store.dispatch