import Banner from "./components/Banner"
import { Card } from "antd"
import ArticleCard from "./components/ArticleCard"
import CategoryCard from "./components/CategoryCard"
import "./index.scss"
export default function Home(){
  const latestArticles=[

 {
  id:1,
  title:"React Hooks详解",
  desc:"深入理解useState和useEffect",
  author:"admin",
  createTime:"2026-07-31"
 },


 {
  id:2,
  title:"TypeScript入门",
  desc:"从JavaScript到TypeScript",
  author:"admin",
  createTime:"2026-07-30"
 }


]

const hotArticles=[

 {
  id:3,
  title:"React18源码分析",
  desc:"深入理解React架构",
  author:"admin",
  createTime:"2026-07-29"
 },


 {
  id:4,
  title:"Webpack原理",
  desc:"模块打包机制解析",
  author:"admin",
  createTime:"2026-07-28"
 }

]

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
          latestArticles.map(item=>(
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