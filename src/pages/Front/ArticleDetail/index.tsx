import {Card,Tag} from "antd"
import CommentItem from "../../../components/CommentItem"
import CommentList from "../../../components/CommentList"
import CommentInput from "../../../components/CommentInput"
import { articles } from "../../../mock/article"
import "./index.scss"
import { useParams } from "react-router-dom"
export default function ArticleDetailFront(){
  const {id} = useParams()
 const article = articles.find(item=>item.id===Number(id))
   if (!article) {
    return <Card>文章不存在</Card>
  }

  return(
    <div className="article-detail">
      <Card>
        <h1>
     {article.title}
        </h1>

        <div className="article-info">
        <span>
        作者：
        {article.author}
        </span>

        <span>
        发布时间：
        {article.createTime}
        </span>

        <span>
        阅读量：
        {article.views}
        </span>

        <Tag color="blue">
        {article.category}
        </Tag>

        </div>

        <div className="article-content">
        {
        article.content
        }
        </div>

      </Card>

      <div className="comment-area">
       <CommentInput articleId={article.id}/>
       <CommentList articleId={article.id}/>
       </div>
    </div>
  )
}