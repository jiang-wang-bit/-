import { number } from "echarts";
import request from "../request";
import type { ArticleType } from "../types/article";
import type { CategoryListResponse,CategoryType,CategoryStatsType } from "../types/category";

// 获取删除分类
export function getDeletedCategory(){
  return request.get("/categories/trash")
}


// 获取分类列表
export function getCategoryList(params?:{
  page:number,
  pageSize:number,
  keyword?:string

}){
  return request.get<CategoryListResponse>("/categories",{
    params
  })
}



// 分类详情
export function getCategoryDetail(id:number){
  return request.get<CategoryType>(`/categories/${id}`)
}

// 新增分类
export function createCategory(data:{
  name:string,
  description?:string
})
{
  return request.post("/categories",data)
}

// 修改分类
export function updateCategory(id:number,data:{
  name:string,
  description?:string
})
{
  return request.put(`/categories/${id}`,data)
}


// 删除分类
export function deleteCategory(
    id:number
){

    return request.delete(
        `/categories/${id}`
    )

}

// 恢复分类
export function restoreCategory(id:number){
  return request.put(`/categories/${id}/restore`)
}


// 获取分类文章
export function getCategoryArticles(id:number){
  return request.get<{category:{
    id:number
    name:string
  },articles:ArticleType[]}>(`/categories/${id}/articles`)
}


// 彻底删除
export function forcedeleteCategory(id:number){
  return request.delete(`/categories/${id}/force`)
}

export function getCategoryStats(){

    return request.get<CategoryStatsType[]>(
        "/categories/stats"
    )

}

// 批量删除
export function batchTrashCategory(ids:number[]){
  return request.delete("/categories/batch-trash",{
    data:{
      ids
    }
  })
}

// 批量永久删除
export function batchDeleteCategory(ids:number[]){
  return request.delete("/categories/batch-delete",{
    data:{
      ids
    }
  })
}

// 批量恢复
export function batchRestoreCategory(ids:number[]){
  return request.put("/categories/batch-restore",{
   ids
  })
}