import { Button,Input,Card,Space,Typography,Avatar} from "antd";
import { useState,useEffect,useRef} from "react";
import "./index.scss"
import { useDispatch} from "react-redux";
import CommentInput from "../CommentInput";
import ReplyItem from "../ReplyItem";
import {
  UserOutlined,LikeOutlined,MessageOutlined
} from "@ant-design/icons";
import { likeComment } from "../../store/modules/comment";

interface CommentType{
id:number;
articleId:number;
username:string;
content:string;
status:string;
time:string;
parentId:number|null;
like:number;
liked:boolean;
}
interface Props{
comment:any;
articleId:number
comments:CommentType[];
}
export default function CommentItem({comment,articleId,comments}:Props){
  const dispatch = useDispatch()
  const [replyId,setReplyId]=useState<number|null>(null)
    const replyRef = useRef<HTMLDivElement>(null)
    function getAllReplies(id:number){
    const result:CommentType[]=[]

    function find(parentId:number){
    comments.forEach(item=>{
    if(
      item.parentId===parentId
      &&
      item.status==="通过"
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
          {comment.time}
          </Typography.Text>

         {/* 点赞按钮 */}
          <Button type="text" size="small" icon={<LikeOutlined/>} onClick={()=>{
            dispatch(likeComment(comment.id))}}>
         {
            comment.liked? comment.like:"点赞"
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