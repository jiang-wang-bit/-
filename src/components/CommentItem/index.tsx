import { Button,Input,Card,Space,Typography,Avatar,message} from "antd";
import { useState,useEffect,useRef} from "react";
import "./index.scss"
import { useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import CommentInput from "../CommentInput";
import { likeComment,unlikeComment } from "../../api/comment";
import ReplyItem from "../ReplyItem";
import { formatCommentTime } from "../../utils/formatTime";
import {
  UserOutlined,LikeOutlined,MessageOutlined
} from "@ant-design/icons";
import type { RootState } from "../../store";
import type { CommentType } from "../../types/comment";

interface Props{
comment:CommentType;
articleId:number
comments:CommentType[];
}
export default function CommentItem({comment,articleId,comments}:Props){
  const dispatch = useDispatch()
  const [replyId,setReplyId]=useState<number|null>(null)
  const replyRef = useRef<HTMLDivElement>(null)
  const userInfo=
useSelector(
(state:RootState)=>state.user.userInfo
)
  const [liked,setLiked] = useState(comment.liked)
  const [likeCount,setLikeCount] = useState(comment.like)
    function getAllReplies(id:number){
    const result:CommentType[]=[]

    function find(parentId:number){
    comments.forEach(item=>{
    if(
      item.parentId===parentId
      &&
      item.status==="normal"
    ){
      result.push(item)
      find(item.id)
    }
   })
 }
 find(id)
 return result
}
    //  点击外部输入框消失
     useEffect(()=>{
       function handleClickOutside(event:MouseEvent){
        const target = event.target as HTMLElement
        if(target.closest(".ant-popover")){
          return
        }
        if(replyRef.current&&!replyRef.current.contains(event.target as Node))
        {
         setReplyId(null)
        }
       }
       document.addEventListener("click",handleClickOutside)

       return()=>{
        document.removeEventListener(
          "click",handleClickOutside
        )
       }
  },[])

     const allReplies = getAllReplies(comment.id).sort((a,b)=>new Date(a.time).getTime()-new Date(b.time).getTime())
     const [showAllReplies,setShowAllReplies] = useState(false)
     const replies:CommentType[] = showAllReplies?allReplies:allReplies.slice(0,1)
     console.log(comment.time)
console.log(formatCommentTime(comment.time))
          return (

          <Card style={{
          marginBottom:16}}
          >
          <Space
          align="start"
          size="middle"
          >

          <Avatar
          size={40}
          icon={<UserOutlined/>}
          />
          <div>

          <Typography.Text strong>
          {comment.username}
          </Typography.Text>

          <Typography.Paragraph
          style={{
          marginTop:8
          }} >
          {comment.content}

          </Typography.Paragraph>


         <div className="comment-actions">
          {/* 输入框 */}
          {
          replyId===comment.id&&(
          <div
            ref={replyRef}
            onClick={(e)=>e.stopPropagation()}
          >
            <CommentInput
             articleTitle={comment.articleTitle}
              articleId={articleId}
              parentId={comment.id}
              onSuccess={()=>{
                setReplyId(null)
              }}
            />
          </div>
        )
         }
          {/* 发布时间 */}
            <Typography.Text
          type="secondary"
          >
          {formatCommentTime(comment.time)}
          </Typography.Text>

         {/* 点赞按钮 */}
          <Button type="text" size="small" icon={<LikeOutlined/>} onClick={async()=>{
            if(!userInfo?.id){
              message.warning("请先登录")
              return
            }
            if(liked){
              const res = await unlikeComment(comment.id,userInfo.id)
              setLiked(false)
              setLikeCount(res.likes)
            }else{
              const res = await likeComment(comment.id,userInfo.id)
              setLiked(true)
              setLikeCount(res.likes)
            }
            }}>
            {
            liked?`${likeCount}`:"点赞"
         }
          </Button>
             
         {/* 回复按钮 */}
          <Button
          type="text"
          size="small"
          icon={<MessageOutlined/>}
          onClick={(e)=>{e.stopPropagation()
            setReplyId(comment.id)}
          }
          >
          回复
          </Button>
          <Typography.Text>
            {allReplies.length}条回复
          </Typography.Text>
          </div>
         
         {/* 初级回复 */}
          {
          replies.map(reply=>(
        <ReplyItem key={reply.id} reply={reply} articleId={articleId} comments={comments} />
          ))
          }

          {/* 收起回复 */}
          {
            allReplies.length>1&&(
              <Button type="link" size="small" onClick={()=>setShowAllReplies(!showAllReplies)}>
                {
                  showAllReplies?"收起回复":`查看全部${allReplies.length}条回复`
                }
              </Button>
            )
          }
          </div>
          </Space>
          </Card>

          )

          }