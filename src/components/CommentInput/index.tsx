import {Input,Button,Space,message,Popconfirm} from "antd"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../store"
import { createComment } from "../../api/comment"
interface Props{
  articleTitle?:string;
  articleId:number
  parentId?:number|null
   onSuccess?:()=>void;
   parentName?:string;
}

export default function CommentInput({articleId,parentId,onSuccess,parentName,articleTitle}:Props){
  const [content,setContent] = useState("")
  const submitComment = async()=>{
    if(!content.trim()){
      message.warning("请输入评论内容")
      return
    }
    try{
      await createComment({
        article_id:articleId,
        content,
        parent_id:parentId??null
    })
       message.success("评论提交成功,待审核") 
       setContent("")
       onSuccess?.()
    }catch(err){
      message.error("评论失败")
      console.log(err)
    }
  
  }
  return (
    <div style={{marginTop:30}}>
       <h3>发表评论</h3>
       <Input.TextArea rows={4} placeholder="请输入评论" value={content} onChange={e=>setContent(e.target.value)} />
       <Popconfirm title="确认发布评论?" description="发布后评论将提交审核" okText="确认" cancelText="取消" onConfirm={submitComment}>
       <Button type="primary" style={{marginTop:15}}>发布评论</Button>
       </Popconfirm>
    </div>
  )
}