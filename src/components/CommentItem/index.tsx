import { Button,Input,Card,Space,Typography,Avatar} from "antd";
import { useState} from "react";
import CommentInput from "../CommentInput";
import {
  UserOutlined
} from "@ant-design/icons";

interface CommentType{

id:number;

articleId:number;

username:string;

content:string;

status:string;

time:string;

parentId:number|null;

}
interface Props{
comment:any;
articleId:number
comments:CommentType[];
}
export default function CommentItem({comment,articleId,comments}:Props){
const [replyId,setReplyId]=useState<number|null>(null)
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
          }}

          >
          {comment.content}

          </Typography.Paragraph>



          <Typography.Text
          type="secondary"
          >

          {comment.time}

          </Typography.Text>



          <br/>


          <Button

          type="link"

          size="small"

          onClick={()=>setReplyId(comment.id)}

          >

          回复

          </Button>



          {
          replyId===comment.id&&(

          <CommentInput

          articleId={articleId}

          parentId={comment.id}

          onSuccess={()=>setReplyId(null)}

          />

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