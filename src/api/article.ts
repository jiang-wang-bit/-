import { articles } from "../mock/article";
import request from "../request";
import { ArticleType } from "../types/article";
// 获取文章列表
export async function getArticleList(){
  const res=  await request.get<ArticleType[]>("/articles")
 return res.data
}
// 文章详情
export function getArticleDetail(id:number){
  return request.get(`article/${id}`).then(res=>res.data)
}
// 创建文章
export function createArtilcle(data:any){
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
// 获取点赞状态api
export async function getLikeStatus(id:number){
  const res = await request.get(`/article/${id}/like`)
  return res.data
}
// 点赞
export async function likeArticle(id:number){
  const res = await request.post(`/article/${id}/like`)
  return res.data
}
// 取消点赞
export async function unlikeArticle(id:number){
  const res = await request.delete(`/article/${id}/like`)
  return res.data
}
//获取收藏状态
export async function getFavoriteStatus(id:number){
  const res = await request.get(`/article/${id}/favorite`)
  return res.data
}
// 收藏文章
export async function favoriteArticle(id:number){
  const res = await request.post(`/article/${id}/favorite`)
  return res.data
}
// 取消收藏
export async function unfavoriteArticle(id:number){
  const res = await request.delete(`/article/${id}/favorite`)
  return res.data
}