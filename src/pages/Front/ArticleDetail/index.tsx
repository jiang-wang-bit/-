import {Card,Tag,Button} from "antd"
import CommentItem from "../../../components/CommentItem"
import CommentList from "../../../components/CommentList"
import CommentInput from "../../../components/CommentInput"
import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {useEffect} from "react"
import ReactMarkdown from "react-markdown"
import { addFavorite,removeFavorite } from "../../../store/modules/favorite"
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
  //  收藏状态
const favorites = useSelector((state:RootState)=>state.favorite.list)
const [categories,setCategories] = useState<CategoryType[]>([])
 useEffect(()=>{
      getCategoryList().then(res=>{ 
        setCategories(res)
      })
  },[])
   const article= articles.find(item=>item.id===Number(id))
     if (!article) {
    return <Card>文章不存在</Card>
  }
  const recommendArticles = articles.filter(item=>item.categoryId===article?.categoryId && item.id!==article?.id).slice(0,3)
  //  获取当前文章位置
 const currentIndex = articles.findIndex(item=>item.id===article?.id)
 const prevArticle = articles[currentIndex-1]
 const nextArticle = articles[currentIndex+1]
const isFavorite = favorites.includes(article.id)
  const category = categories.find(item=>item.id===article?.categoryId)
  return(
    <div className="article-detail">
      <Card>
        <h1>
     {article.title}
        </h1>

        <Button type={isFavorite ? "primary" : "default"} onClick={() => {
          if (isFavorite) {
            dispatch(removeFavorite(article.id))
          } else {
            dispatch(addFavorite(article.id))
          }
        }}>
          {isFavorite ?  "❤️ 已收藏":
 "🤍 收藏文章"}
        </Button>

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
        <ReactMarkdown>
          {article.content}
        </ReactMarkdown>
        }
        </div>

      </Card>

      <div className="article-switch">
        <Button disabled={!prevArticle} onClick={()=>{if(prevArticle) navigate(`/article/${prevArticle.id}`)}}>上一篇</Button>
        <Button disabled={!nextArticle} onClick={()=>{if(nextArticle) navigate(`/article/${nextArticle.id}`)}}>下一篇</Button>
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
       <CommentInput articleId={article.id} articleTitle={article.title}/>
       <CommentList articleId={article.id}/>
       </div>
    </div>
  )
}