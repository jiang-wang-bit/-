import {Input,Button,Space,message} from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { addComments } from "../../store/modules/comment"
interface Props{
  articleId:number
}

export default function CommentInput({articleId}:Props){
  const dispatch = useDispatch()
  const [content,setContent] = useState("")
  const submitComment = ()=>{
    if(!content.trim()){
      message.warning("请输入评论内容")
      return
    }
    const comment = {
      id:Date.now(),
      articleId,
      username:"游客",
      content,
      status:"待审核",
      time:new Date().toLocaleDateString(),
      parentId:null
    }
    dispatch(addComments(comment))
    setContent("")
    message.success("评论提交成功,待审核")
  }
  return (
    <div style={{marginTop:30}}>
       <h3>发表评论</h3>
       <Input.TextArea rows={4} placeholder="请输入评论" value={content} onChange={e=>setContent(e.target.value)} />
       <Button type="primary" style={{marginTop:15}} onClick={submitComment}>发布评论</Button>
    </div>
  )
}