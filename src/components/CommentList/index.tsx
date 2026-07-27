
import { useSelector } from "react-redux"
interface Props {
  articleId:number
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
 const articleComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过")
  return(
    <div>
      <h3>评论</h3>
      {
        articleComments.map(item=>(
          <div key={item.id}>
            <p>
              {item.username}
            </p>
            <p>
              {item.content}
            </p>
            <span>
              {item.time}
            </span>
             </div>
        ))
      }
    </div>
  )
}