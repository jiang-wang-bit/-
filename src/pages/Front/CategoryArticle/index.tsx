import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import ArticleCard from "../../Home/components/ArticleCard"
import type { RootState } from "../../../store"
import type {ArticleType} from "../../../types/article"
export default function CategoryArticle(){
  const {id} = useParams()
  const articles = useSelector((state: RootState) => state.article.list) as ArticleType[]
  const categoryArticles = articles.filter(item=>String(item.categoryId)===String(id))
  return(
    <div>
      <h2>分类文章</h2>
      {
        categoryArticles.length>0? categoryArticles.map(item=>(<ArticleCard key={item.id} article={item}/>)):<p>暂无文章</p>
      }
    </div>
  )
} 