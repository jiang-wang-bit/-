import { Button,Typography } from "antd"
import { LikeOutlined,MessageOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useDispatch, UseDispatch} from "react-redux"
import { likeComment } from "../../store/modules/comment"
import CommentInput from "../CommentInput"
interface Props{
  reply:any;
  articleId:number;
  comments:any[]
}
export default function ReplyItem({reply,articleId,comments}:Props){
  const dispatch = useDispatch()
  const [replyId,setReplyId] = useState<number|null>(null)
  const children = comments.filter(item=>item.parentId ===reply.id&&item.status ==="通过")
  return(
      <div className="reply-item">


          {/* 用户 */}

          <Typography.Text strong>

          {reply.username}

          </Typography.Text>



          <Typography.Text>

          &nbsp; 回复 &nbsp;

          {reply.parentName}

          </Typography.Text>



          {/* 内容 */}

          <Typography.Paragraph>

          {reply.content}

          </Typography.Paragraph>



          <div className="reply-action">


          {/* 时间 */}

          <Typography.Text type="secondary">
          {reply.time}
          </Typography.Text>
          {/* 点赞 */}
          <Button
          type="text"
          size="small"
          icon={<LikeOutlined/>}
          onClick={()=>{
          dispatch(
          likeComment(reply.id)
          )

          }}

          >
          {
          reply.liked?
          reply.like:

          "点赞"

          }
          </Button>
          {/* 回复 */}

          <Button
          type="text"
          size="small"
          icon={<MessageOutlined/>}
          onClick={()=>{
          setReplyId(reply.id)
          }}
          >
          回复
          </Button>

          </div>

          {/* 回复输入框 */}

          {

          replyId===reply.id && (

          <CommentInput
          articleId={articleId}
          parentId={reply.id}
          parentName = {reply.username}
          onSuccess={()=>setReplyId(null)}

          />

          )}
          {/* ⭐递归核心 */}

          {
          children.map(child=>(
          <ReplyItem
          key={child.id}
          reply={child}
          articleId={articleId}
          comments={comments}

          />

          ))
          }
          </div>

  )
}