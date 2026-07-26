import { createSlice} from "@reduxjs/toolkit";
interface ArticleType{
  id:number;
  title:string;
  category:string;
  content:string;
  status:string;
  time:string;
  author:string;
}
interface ArticleState{
  list:ArticleType[];
}
const defaultArticles = [{
  
      id:1,
      title:"React学习",
      category:"React",
      content:"react hooks",
      status:"发布",
      time:"2026-07-26",
      author:"admin"
}]
const initialState:ArticleState={
     list:JSON.parse(localStorage.getItem("articles")||JSON.stringify(defaultArticles))
}
const articleSlice = createSlice({
  name:"article",
  initialState,
  reducers:{
      addArticle:(state,action)=>{
        state.list.push(action.payload)
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
      }
  }

})
export const{addArticle,deleteArticle,updateArticle} = articleSlice.actions
export default articleSlice.reducer