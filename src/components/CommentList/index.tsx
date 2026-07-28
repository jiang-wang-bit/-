
import { useSelector } from "react-redux"
import{Divider,Empty,Typography} from "antd"
import CommentItem from "../CommentItem";
import "./index.scss"
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

}
export default function CommentList({articleId}:Props){
 
 const comments = useSelector((state:any)=>state.comment.list as CommentType [])
 const articleComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过"&&item.parentId===null)
  return(
   
  <div className="comment-list">


    <Divider/>


    <Typography.Title level={3}>
      评论 ({articleComments.length})
    </Typography.Title>
    {
      articleComments.length===0
      ?
      <Empty
       description="暂无评论"
      />
      :
      articleComments.map(item=>(
       <CommentItem key={item.id} comment={item} articleId={articleId} comments={comments}/>
      ))
    }
  </div>
  )
}