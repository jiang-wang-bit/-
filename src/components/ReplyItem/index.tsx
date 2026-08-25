import { Button,Typography,message } from "antd"
import { LikeOutlined,MessageOutlined } from "@ant-design/icons"
import { useState,useEffect } from "react"
import { useSelector } from "react-redux"
import { formatCommentTime } from "../../utils/formatTime"
import "./index.scss"
import { likeComment,unlikeComment,getCommentStatus} from "../../api/comment"
import CommentInput from "../CommentInput"
import type { RootState } from "../../store"
interface Props{
  reply:any;
  articleId:number;
  comments:any[]
}
export default function ReplyItem({reply,articleId,comments}:Props){
  const userInfo=
useSelector(
(state:RootState)=>state.user.userInfo
)
  const [replyId,setReplyId] = useState<number|null>(null)
  const [likeCount,setLikeCount]=useState(reply.like)
const [liked,setLiked]=useState(reply.liked)
  const parent = comments.find(item=>item.id===reply.parentId)
  const children = comments.filter(item=>item.parentId ===reply.id&&
 item.status==="normal")
  const childCount = children.length
  const shouldShow = 
reply.status==="normal"
||
(
 reply.status==="deleted"
 &&
 hasNormalDescendant(reply.id)
)
  useEffect(()=>{


if(!userInfo?.id)
return



getCommentStatus(
 reply.id,
 userInfo.id

).then(res=>{


setLiked(res.liked)

setLikeCount(res.likes)


})


},[ userInfo?.id,
 reply.id])

 function hasNormalDescendant(id:number):boolean{

  const children = comments.filter(
    item=>item.parentId===id
  )


  return children.some(child=>{

    // 直接子评论正常
    if(child.status==="normal"){
      return true
    }


    // 子评论删除，继续查找
    if(child.status==="deleted"){
      return hasNormalDescendant(child.id)
    }


    return false

  })

}
  
if(!shouldShow){
  return null
}
  return(
    <div className="reply-wrapper">
      <div className="reply-item">
          {/* 用户 */}

          <Typography.Text strong>
          {reply.username}
          </Typography.Text>



          <Typography.Text>

          &nbsp; 回复 &nbsp;

          {
          (parent?.status==="removed"||parent?.status==="deleted")
          ?
          "已删除用户"
          :
          parent?.username
          }

          </Typography.Text>



          {/* 内容 */}

          <Typography.Paragraph>

          {
         
          (reply.status==="deleted")
          ?

          <span className="deleted-comment">
            该评论已删除
          </span>

          :

          reply.content

          }
          </Typography.Paragraph>



          <div className="reply-action">


          {/* 时间 */}

          <Typography.Text type="secondary">
          {formatCommentTime(reply.time)}
          </Typography.Text>

          {/* 点赞 */}
          {reply.status==="normal"&&
           <Button
          type="text"
          size="small"
          icon={<LikeOutlined/>}
          onClick={async()=>{
            if(!userInfo?.id){
  message.warning("请先登录")
  return
}
         if(liked){
          const res = await unlikeComment(reply.id,userInfo.id)
          setLikeCount(res.likes)
          setLiked(false)
         }else{
          const res = await likeComment(reply.id,userInfo?.id)
          setLiked(true)
          setLikeCount(res.likes)
         }

          }}

          >
          {
            liked?`${likeCount}`:"点赞"
         }
          </Button>}
          
             {/* 回复 */}
          {reply.status==="normal"&&
          <Button
          type="text"
          size="small"
          icon={<MessageOutlined/>}
          onClick={()=>{
          setReplyId(reply.id)
          }}
          >
          回复
          </Button>}
       
        
        {/* 回复数量 */}
        <Typography.Text type="secondary">
          {childCount}条回复
        </Typography.Text>
      

          </div>

          {/* 回复输入框 */}

          {

          replyId===reply.id&&reply.status==="normal" && (

          <CommentInput
          articleTitle={reply.articleTitle}
          articleId={articleId}
          parentId={reply.id}
          parentName = {reply.username}
          onSuccess={()=>setReplyId(null)}

          />

          )}
         
          </div>
          </div>

  )
}