import "./index.scss"
import {Card,Empty} from "antd"
import {useSelector} from "react-redux"
import type { RootState } from "../../../store"
import ArticleCard from "../../Home/components/ArticleCard"
export default function Favorite() {
  const articles = useSelector((state: RootState) => state.article.list)
  const favorites = useSelector((state: RootState) => state.favorite.list)
  const favoriteArticles = articles.filter(item=>favorites.includes(item.id))
  return (
    <div className="favorite-page">
      <Card title="我的收藏">
        {
          favoriteArticles.length>0? favoriteArticles.map(item=>(<ArticleCard key={item.id} article={item}/>)):<Empty description="暂无收藏文章"/>
        }

      </Card>

    </div>
  )
}