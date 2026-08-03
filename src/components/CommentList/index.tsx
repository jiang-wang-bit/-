import type { CommentType } from "../../types/comment";
import { useSelector } from "react-redux"
import{Button, Divider,Empty,Typography} from "antd"
import CommentItem from "../CommentItem";
import type { RootState } from "../../store";
import "./index.scss"
import { useState } from "react";
interface Props {
  articleId:number;
}
export default function CommentList({articleId}:Props){
 
 const comments = useSelector((state:RootState)=>state.comment.list)
 const articleComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过"&&item.parentId===null)
 const totalComments = comments.filter(item=>item.articleId===articleId&&item.status==="通过").length
 const [showAllComments,setShowAllComments] = useState(false)
 const [sortType,setSortType] = useState<"latest"|"hot">("latest")
 const sortedComments = [...articleComments].sort(
  (a,b)=>{
    if(sortType==="hot"){
      return b.like-a.like
    }
    return(
      new Date(b.time).getTime()- new Date(a.time).getTime()
    )
  }
 )
 const showComments = showAllComments?sortedComments:sortedComments.slice(0,1)
  return(
   
  <div className="comment-list">


    <Divider/>


    <Typography.Title level={3}>
      评论 ({totalComments})
    </Typography.Title>

    <div className="comment-sort">
        <Button type="link" className={sortType==="latest"?"active": ""} onClick={()=>setSortType("latest")} size="small">
           最新
        </Button>

        <Button type="link" className={sortType==="hot"?"active":""} onClick={()=>setSortType("hot")} size="small">
          最热
        </Button>
    </div>
    
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