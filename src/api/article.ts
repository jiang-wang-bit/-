
import request from "../request";
import { ArticleType,ArticlePageResponse } from "../types/article";
export interface ArticleResponse{

 id:number

 title:string

 content:string

 category_id:number

 category_name:string

 status:string

 cover:string

 author:string

 likes:string

 views:string

 create_time:string

 update_time:string

}
// 获取文章列表
export async function getArticleList(params:any):Promise<ArticlePageResponse>{

const res = await request.get(
    "/articles",
    {
        params
    }
)


return {

    list:res.list.map((item:ArticleResponse)=>({

        id:item.id,

        title:item.title,

        content:item.content,

        desc:item.content?.slice(0,20)||"",

        cover:item.cover,

        author:item.author,

        categoryId:item.category_id,

        categoryName:item.category_name,

        status:item.status,

        views:item.views,

        likes:item.likes,

        createTime:item.create_time,

        updateTime:item.update_time

    })),

    total:res.total

}

}
// 文章详情
export async function getArticleDetail(id:number){
      
    const res =
    await request.get<any>(
    `/articles/${id}`
    )

    return {

    id:res.id,

    title:res.title,

    content:res.content,

    cover:res.cover,

    author:res.author,

    categoryId:res.category_id,

    status:res.status,

    views:res.views,

    likes:res.likes,

    createTime:res.create_time,

    updateTime:res.update_time

    }
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
    `/articles/${id}`,
    data
  )
}
// 删除文章
export function forceDeleteArticleApi(id:number){
  return request.delete(`/articles/${id}/force`)
}

// 批量彻底删除
export function batchDeleteArticle(ids:number[]){
  return request.delete("/articles/batch/force",
    {
      data:{
        ids
      }
    }
  )
}
// 恢复文章
export function restoreArticle(id:number){
  return request.patch(`/articles/${id}/restore`)
}

// 批量恢复文章
export function batchRestoreArticle(ids:number[]){
  return request.patch("/articles/batch/restore",ids)
}


// 修改文章状态
export function updateArticleStatus(id:number,status:string){
  return request.patch(
    `/articles/${id}/status`,
    {
      status
    }
  )
}
// 获取点赞状态api
export async function getLikeStatus(id:number){
  const res = await request.get(`/articles/${id}/like/status`
  )
  return res
}
// 点赞
export async function likeArticle(id:number){
  const res = await request.post(`/articles/${id}/like`
  )

  return res
}
// 取消点赞
export async function unlikeArticle(id:number){
  const res = await request.delete(`/articles/${id}/like`
  )
  return res
}
//获取收藏状态
export async function getFavoriteStatus(id:number){
  const res = await request.get(`/articles/${id}/favorite/status`)
  return res
}
// 收藏文章
export async function favoriteArticle(id:number){
  const res = await request.post(`/articles/${id}/favorite` )
  return res
}
// 取消收藏
export async function unfavoriteArticle(id:number){
  const res = await request.delete(`/articles/${id}/favorite`)
  return res
}
// 增加文章阅读量
export async function increaseArticleView(id:number){
  const res = await request.post(`/articles/${id}/view`)
  return res
}

// 添加文章历史记录
export function addHistory(articleId:number){
  return request.post(`/user/history`,null,
    {
      params:{
        article_id:articleId
      }
    }
  )
}

// 获取阅读历史
export function getHistory(){
  return request.get("/user/history"
  )
}

// 获得回收站文章
export function getTrashArticle(params:any){
  return request.get("/articles/trash",{
    params
  })
}