import { articles } from "../mock/article";
import request from "../request";
// 获取文章列表
export function getArticleList(){
  return request.get("/articles")
}
// 文章详情
export function getArticleDetail(id:number){
  return request.get(`article/${id}`)
}
// 创建文章
export function createArtilce(data:any){
  return request.post(
    "/articles",
    data
  )
}
// 更新文章
export function updateArticleApi(id:number,data:any){
  return request.put(
    `/article.${id}`,
    data
  )
}
// 删除文章
export function deleteArticleApi(id:number){
  return request.delete(`/article/${id}`)
}
// 修改文章状态
export function updateArticleStatus(id:number,status:string){
  return request.patch(
    `/article/${id}/status`,
    {
      status
    }
  )
}