import type { CommentType} from "../../types/comment";
import { createSlice } from "@reduxjs/toolkit";
interface CommentState {
  list: CommentType[]
}
const initialState: CommentState = {
  list: JSON.parse(localStorage.getItem("comments") || "[]")
}
const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // 添加评论
    setComments: (state, action) => {
      state.list = action.payload
      localStorage.setItem("comments", JSON.stringify(state.list))
    },
    addComments:(state,action)=>{
       state.list.push(action.payload)
       localStorage.setItem("comments",JSON.stringify(state.list))
    },
    // 删除评论
    deleteComments: (state, action) => {
      state.list = state.list.filter(item => item.id !== action.payload)
      localStorage.setItem("comments", JSON.stringify(state.list))
    },
    // 更新状态
    updateStatus: (state, action) => {
      const comment = state.list.find(item => item.id === action.payload.id)
      if (comment) {
        comment.status = action.payload.status
        localStorage.setItem("comments", JSON.stringify(state.list))
      }
    },
    // 点赞
    likeComment:(state,action)=>{
      const comment = state.list.find(item=>item.id===action.payload)
    
      if(comment){
        if(comment.liked){

          comment.like = (comment.like ||0)-1
        }
        else{
          comment.like = (comment.like||0)+1
        }
        comment.liked=!comment.liked
        localStorage.setItem("comments",JSON.stringify(state.list))
      }
    }
  }
})
export const { setComments, deleteComments, updateStatus,addComments,likeComment } = commentSlice.actions
export default commentSlice.reducer