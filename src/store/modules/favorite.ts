import {createSlice} from "@reduxjs/toolkit"

interface FavoriteState{
  list:number[]
}
const initialState:FavoriteState={
  list:JSON.parse(localStorage.getItem("favorite")||"[]")
}

const favoriteSlice = createSlice({
  name:"favorite",
  initialState,
  reducers:{
    // 收藏文章
   addFavorite:(state,action)=>{
    if(!state.list.includes(action.payload)){
      state.list.push(action.payload)
    }
    localStorage.setItem("favorite",JSON.stringify(state.list))
   },
    // 取消收藏
    removeFavorite:(state,action)=>{
      state.list = state.list.filter(item=>item!==action.payload)
      localStorage.setItem("favorite",JSON.stringify(state.list))
    }
  }
})

export const {addFavorite,removeFavorite} = favoriteSlice.actions
export default favoriteSlice.reducer