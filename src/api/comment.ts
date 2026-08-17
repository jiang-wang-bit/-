import { use } from "echarts";
import request from "../request";
import type { BackendCommentType } from "../types/comment";
// 获取评论
export function getCommentList(articleId:number):Promise<BackendCommentType[]>{
  return request.get(`/comments/article/${articleId}`)}

// 发布评论
export function createComment(data:{
  article_id:number,
  content:string,
  parent_id?:number|null
}){
  return request.post("/comments",data)
}

// 删除评论
export function deleteComment(id:number){
  return request.delete(`/comments/${id}`)
}

// 获得全部评论
export function getAllComments(){
  return request.get<BackendCommentType[]>("/comments")

}

// 修改评论状态
export function updateCommentStatus(id:number,status:string){
  return request.patch(`/comments/${id}/status`,{
    status
  })
}

// 评论点赞
export function likeComment(id:number,userId:number){
  return request.post(`/comments/${id}/like`,
    null,
    {
      params:{
        user_id:userId
      }
    }
  )
}

// 取消点赞
export function unlikeComment(id:number,userId:number){
  return request.delete(`/comments/${id}/like`,
    {
      params:{
        user_id:userId
      }
    }
  )
}

export function getCommentStatus(id:number,userId:number){
  return request.get(
 `/comments/${id}/like-status`,
 {
 params:{
   user_id:userId
 }
 }
)
}

// 获得我的评论
export function getMyComments(){
  return request.get("/user/comments")
}