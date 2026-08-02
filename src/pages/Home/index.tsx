import Banner from "./components/Banner"
import { Card } from "antd"
import {useSelector} from "react-redux"
import type { RootState } from "../../store"
import ArticleCard from "./components/ArticleCard"
import CategoryCard from "./components/CategoryCard"
import "./index.scss"
export default function Home(){

  const articles = useSelector((state:RootState)=>state.article.list)
  const hotArticles = [...articles].sort((a,b)=>b.views-a.views).slice(0,5)
  const categories=[

 {
  id:1,
  name:"React"
 },

 {
  id:2,
  name:"Vue"
 },

 {
  id:3,
  name:"Python"
 }

]
  return (
    <div className="home">
      <Banner/>

      <section className="article-wrapper">
        <div className="latest-section">
         <h2>最新文章</h2>
         {
          articles.slice(0,5).map(item=>(
            <ArticleCard key={item.id} article={item}/>
          ))
         }
         </div>

         {/* 热门文章 */}
         <div className="hot-section">
          <h2>热门文章</h2>
          {
            hotArticles.map(item=>(
              <ArticleCard key={item.id} article={item}/>
            ))
          }
         </div>
         </section>
  
       <section className="category-section">
          <Card title="分类" className="category-card">
          <div className="category-list">
          {
            categories.map(item=>(
              <CategoryCard key={item.id} category={item}/>
            ))
          }
          </div>
          </Card>
      </section>
      
      </div>
  )
}