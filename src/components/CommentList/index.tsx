
import { useSelector } from "react-redux"
import{Button, Divider,Empty,Typography} from "antd"
import CommentItem from "../CommentItem";
import "./index.scss"
import { useState } from "react";
interface Props {
  articleId:number;
}
interface CommentType{
 id:number;
 articleId:number;
 username:string;
 content:string;
 status:string;
 time:string;
 parentId:number|null;
 like:number;
 liked:true
 parentName:string
}
export default function CommentList({articleId}:Props){
 
 const comments = useSelector((state:any)=>state.comment.list as CommentType [])
 const articleComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过"&&item.parentId===null)
 const totalComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过").length
 const [showAllComments,setShowAllComments] = useState(false)
 const showComments = showAllComments?articleComments:articleComments.slice(0,1)
  return(
   
  <div className="comment-list">


    <Divider/>


    <Typography.Title level={3}>
      评论 ({totalComments})
    </Typography.Title>
    {
      articleComments.length===0
      ?
      <Empty
       description="暂无评论"
      />
      :
      showComments.map(item=>(
       <CommentItem key={item.id} comment={item} articleId={articleId} comments={comments}/>
      ))
    }
    {
      articleComments.length>1&&(
        <Button type="link" onClick={()=>setShowAllComments(!showAllComments)}>
         {
          showAllComments?"收起评论":`查看全部${articleComments.length}条评论`
         }
        </Button>
      )
    }
  </div>
  )
}