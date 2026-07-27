import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/auth";
import Article from "../pages/Article";
import articleReducer from "./modules/article"
import commentReducer from "./modules/comment"
export const store = configureStore({
  reducer: {
    user: userReducer,
    article: articleReducer,
    comment:commentReducer
  }
});

// 获取仓库全部状态的类型
export type RootState = ReturnType<typeof store.getState>

// 获取 dispatch 的完整类型
export type AppDispatch = typeof store.dispatch