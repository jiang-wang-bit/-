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

// 批量审核通过
export function batchApprove(ids:number[]){
  return request.put("/comments/batch_approve",{
    ids
  })
}

// 批量软删除
export function batchDelete(ids:number[]){
  return request.delete("/comments/batch_delete",{
    data:{
      ids
    }
  })
}

// 获取回收站评论
export function getTrashComments(){
  return request.get("/comments/trash")
}

// 恢复评论
export function restoreComment(id:number){
  return request.put(`/comments/${id}/restore`)
}

// 彻底删除评论
export function deletePermanent(id:number){
  return request.delete(`/comments/${id}/permanent`)
}

// 批量恢复
export function batchRestoreComment(ids:number[]){
  return request.put("/comments/batch_restore",{
  ids
  })
}

// 批量彻底删除
export function batchDeletePermanent(ids:number[]){
  return request.delete("/comments/batch_delete_permanent",{
    data:{
      ids
    }
  })
}