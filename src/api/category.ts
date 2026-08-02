import type {CategoryType } from "../types/category"
import { setStorage,getStorage } from "../utils/storage"

const STORAGE_KEY="categoryList"
// 新增分类
export  function createCategory(data:{name:string}){
  const categoryList = getStorage<CategoryType[]>(STORAGE_KEY)
   const newCategory:CategoryType = {
       id:Date.now(),
      name:data.name,
      createTime:new Date().toLocaleDateString()
   }
   categoryList.push(newCategory)
   setStorage(STORAGE_KEY,categoryList)
   return Promise.resolve(
    newCategory
   )
}

// 获取分类列表
export function getCategoryList(){
  const categoryList = getStorage<CategoryType[]>(STORAGE_KEY)
  return Promise.resolve(
    categoryList
  )
}

// 删除分类
export function deleteCategory(id:number){
  const categoryList = getStorage<CategoryType[]>(STORAGE_KEY)
  const newList = categoryList.filter(item=>item.id!==id)
  setStorage(STORAGE_KEY,newList)
  return Promise.resolve(
    true
  )
}

// 获取分类详情
export function getCategoryDetail(id:number){
  const categoryList = getStorage<CategoryType[]>(STORAGE_KEY)
  const category = categoryList.find(item=>item.id===id)
  return Promise.resolve(category)
}

// 修改分类
export function updateCategory(id:number,data:{name:string}){
   const categoryList = getStorage<CategoryType[]>(STORAGE_KEY)
   const index = categoryList.findIndex(item=>item.id===id)
   if(index!==-1){
    categoryList[index] ={
      ...categoryList[index],
      name:data.name
    }
   }
   setStorage(STORAGE_KEY,categoryList)
   return Promise.resolve(categoryList[index])
}