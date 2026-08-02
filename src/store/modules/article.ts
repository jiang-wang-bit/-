import { createSlice} from "@reduxjs/toolkit";
import type {ArticleType} from "../../types/article"
interface ArticleState{
  list:ArticleType[];
}
const defaultArticles = [{
      id:1,
      title:"React学习",
      desc:"react hooks学习",
      category:"React",
      content:"react hooks",
      status:"发布",
      time:"2026-07-26",
      author:"admin",
      views:100
}]
const initialState:ArticleState={
     list:JSON.parse(localStorage.getItem("articles")||JSON.stringify(defaultArticles))
}
const articleSlice = createSlice({
  name:"article",
  initialState,
  reducers:{
      addArticle:(state,action)=>{
        state.list.push({
          ...action.payload,
          views:action.payload.views||0
        })

        localStorage.setItem("articles",JSON.stringify(state.list))
      },
      deleteArticle:(state,action)=>{
        state.list = state.list.filter(item=>String(item.id)!==String(action.payload))
        localStorage.setItem("articles",JSON.stringify(state.list))
      },
      updateArticle:(state,action)=>{
        const index = state.list.findIndex(item=>item.id === action.payload.id)
        if (index!==-1){
          state.list[index] = action.payload
        }
        localStorage.setItem("articles",JSON.stringify(state.list))
      },
      // 增加阅读量
      increaseViews:(state,action)=>{
        const article = state.list.find(item=>item.id===action.payload)
        if(article){
          article.views = (article.views||0)+1
        }
        localStorage.setItem("articles",JSON.stringify(state.list))
      }
  }

})
export const{addArticle,deleteArticle,updateArticle,increaseViews} = articleSlice.actions
export default articleSlice.reducer