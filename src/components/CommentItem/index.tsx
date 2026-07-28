import { Button,Input,Card,Space,Typography,Avatar} from "antd";
import { useState,useEffect,useRef} from "react";
import "./index.scss"
import { useDispatch} from "react-redux";
import CommentInput from "../CommentInput";
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
  useEffect(()=>{
       function handleClickOutside(event:MouseEvent){
        if(replyRef.current&&!replyRef.current.contains(event.target as Node))
        {
         setReplyId(null)
        }
       }
       document.addEventListener("mousedown",handleClickOutside)

       return()=>{
        document.removeEventListener(
          "mousedown",handleClickOutside
        )
       }
  },[])
  const replies = comments.filter(item=>item.parentId===comment.id&&item.status==="通过")
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
          onClick={()=>setReplyId(comment.id)}
          >
          回复
          </Button>
          </div>

          {
          replyId===comment.id&&(
            <div ref={replyRef}>
          <CommentInput
          articleId={articleId}
          parentId={comment.id}
          onSuccess={()=>setReplyId(null)}
          />
           </div>
          )
          }
    
          {
          replies.map(reply=>(


                  <div
          key={reply.id}
          className="reply-item"
          >


          <Typography.Text strong>

          {reply.username}

          </Typography.Text>


          <Typography.Text>

          &nbsp; 回复 &nbsp;

          {comment.username}：

          </Typography.Text>


          <Typography.Paragraph>

          {reply.content}

          </Typography.Paragraph>


          <Typography.Text
          type="secondary"
          >

          {reply.time}

          </Typography.Text>


          </div>


          ))

          }


          </div>


          </Space>


          </Card>

          )

          }