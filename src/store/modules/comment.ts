import { CommentType} from "../../pages/Comment/types";
import { createSlice } from "@reduxjs/toolkit";
interface CommentState{
  list:CommentType[]
}
const initialState:CommentState={
  list:JSON.parse(localStorage.getItem("comments")|| "[]")
}
const commentSlice = createSlice({
  name:"comment",
  initialState,
  reducers:{
    // 添加评论
    setComments:(state,action)=>{
      state.list = action.payload
      localStorage.setItem("comments",JSON.stringify(state.list))
    },
    // 删除评论
    deleteComments:(state,action)=>{
      state.list = state.list.filter(item=>item.id!==action.payload)
      localStorage.setItem("comments",JSON.stringify(state.list))
    },
    // 更新状态
    updateStatus:(state,action)=>{
      const comment = state.list.find(item=>item.id===action.payload.id)
      if (comment){
        comment.status = action.payload.status
        localStorage.setItem("comments",JSON.stringify(state.list))
      }
    }
  }
})
 export const {setComments,deleteComments,updateStatus} = commentSlice.actions
  export default commentSlice.reducer