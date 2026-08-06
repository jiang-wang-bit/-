import Banner from "./components/Banner"
import { Card,Input } from "antd"
import {useSelector} from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect,useState } from "react"
import {getCategoryList} from "../../api/category"
import type { CategoryType } from "../../types/category"
import type { RootState } from "../../store"
import ArticleCard from "./components/ArticleCard"
import CategoryCard from "./components/CategoryCard"
import "./index.scss"
export default function Home(){

  const articles = useSelector((state:RootState)=>state.article.list)
  const hotArticles = [...articles].sort((a,b)=>b.views-a.views).slice(0,5)
  const latestArticles = [...articles].sort((a,b)=>{return new Date(b.createTime).getTime()-new Date(a.createTime).getTime()}).slice(0,5)
  const [categories,setCategories] = useState<CategoryType[]>([])
  const navigate = useNavigate()
  useEffect(()=>{
    getCategoryList().then(res=>{ 
      setCategories(res)
    })
  },[])
  return (
    <div className="home">

       {/* 搜索 */}
      <Input.Search placeholder="搜索文章" onSearch={(value)=>{
        navigate(`/article?keyword=${value}`)
      }} style={{ marginBottom: 16,width:300 }}/>

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