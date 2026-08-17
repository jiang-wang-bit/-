import type { CommentType } from "../../types/comment";
import{Button, Divider,Empty,Typography} from "antd"
import CommentItem from "../CommentItem";
import { useEffect,useState } from "react";
import { getCommentList } from "../../api/comment";
import "./index.scss"
interface Props {
  articleId:number;
}
export default function CommentList({articleId}:Props){

//  获取评论
const [comments,setComments] = useState<CommentType[]>([])
//  获取评论
  useEffect(()=>{
      getCommentList(articleId).then(res=>{
        const list:CommentType[] = res.map(item=>({
          id:item.id,
          articleTitle:"",

          articleId: item.article_id,

          userId: item.user_id,

          username:`用户${item.user_id}`,

          content: item.content,

          parentId: item.parent_id,

          status: item.status,

          time: item.create_time,

          // 后端暂时没有点赞数量
          like: 0,
          liked:false,
          parentName:"",

        }))
        setComments(list)
      })
  },[articleId])
// 当前文章一级评论
 const articleComments = comments.filter(item=>Number(item.articleId)===Number(articleId)&&item.status==="normal"&&item.parentId===null)
    console.log(
    "最终一级评论:",
    articleComments
    )
//  所有文章评论数量
 const totalComments = comments.filter(item=>item.articleId===articleId&&item.status==="normal").length
 const [showAllComments,setShowAllComments] = useState(false)
 const [sortType,setSortType] = useState<"latest"|"hot">("latest")

//  排序
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