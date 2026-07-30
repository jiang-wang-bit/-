import type {Category } from "../types/category"
import { setStorage,getStorage } from "../utils/storage"

const STORAGE_KEY="categoryList"
// 新增分类
export  function createCategory(data:{name:string}){
  const categoryList = getStorage<Category[]>(STORAGE_KEY)
   const newCategory:Category = {
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
  const categoryList = getStorage<Category[]>(STORAGE_KEY)
  return Promise.resolve(
    categoryList
  )
}

// 删除分类
export function deleteCategory(id:number){
  const categoryList = getStorage<Category[]>(STORAGE_KEY)
  const newList = categoryList.filter(item=>item.id!==id)
  setStorage(STORAGE_KEY,newList)
  return Promise.resolve(
    true
  )
}