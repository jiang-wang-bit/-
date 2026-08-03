import {Card,Tag,Button} from "antd"
import CommentItem from "../../../components/CommentItem"
import CommentList from "../../../components/CommentList"
import CommentInput from "../../../components/CommentInput"
import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {useEffect} from "react"
import {increaseViews} from "../../../store/modules/article"
import "./index.scss"
import { useParams,useNavigate } from "react-router-dom"
import { useState } from "react"
import {getCategoryList} from "../../../api/category"
import type { CategoryType } from "../../../types/category"
import type { RootState } from "../../../store"
export default function ArticleDetailFront(){
  const {id} = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    if(id){
      dispatch(increaseViews(Number(id)))
    }
  },[id])
  const articles = useSelector((state: RootState)=>state.article.list)
   const article= articles.find(item=>item.id===Number(id))
  const recommendArticles = articles.filter(item=>item.categoryId===article?.categoryId && item.id!==article?.id).slice(0,3)
  //  获取当前文章位置
 const currentIndex = articles.findIndex(item=>item.id===article?.id)
 const prevArticle = articles[currentIndex-1]
 const nextArticle = articles[currentIndex+1]
 const [categories,setCategories] = useState<CategoryType[]>([])
  useEffect(()=>{
      getCategoryList().then(res=>{ 
        setCategories(res)
      })
  },[])
  const category = categories.find(item=>item.id===article?.categoryId)
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
        {category?.name}
        </Tag>

        </div>

        <div className="article-content">
        {
        article.content
        }
        </div>

      </Card>

      <div className="article-switch">
        <Button disabled={!prevArticle} onClick={()=>navigate(`/article/${prevArticle.id}`)}>上一篇</Button>
        <Button disabled={!nextArticle} onClick={()=>navigate(`/article/${nextArticle.id}`)}>下一篇</Button>
      </div>

      {/* 相关文章推荐 */}
      <Card title="相关文章推荐" className="recommend-card">
       {
        recommendArticles.length>0?recommendArticles.map(item=>(
          <div key={item.id} className="recommend-item" onClick={()=>navigate(`/article/${item.id}`)}>
            {item.title}
          </div>
        )) : <p>暂无相关文章</p>
       }
      </Card>

      <div className="comment-area">
       <CommentInput articleId={article.id}/>
       <CommentList articleId={article.id}/>
       </div>
    </div>
  )
}