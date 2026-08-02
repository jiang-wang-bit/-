import "./index.scss"
import {Card,Empty,Pagination} from "antd"
import { useState } from "react"
import {useSelector} from "react-redux"
import CategoryTabs from "../../Home/components/CategoryTabs"
import type { RootState } from "../../../store"
import ArticleCard from "../../Home/components/ArticleCard"
export default function ArticleList(){
  const [page,setPage] = useState(1)
  const articles = useSelector((state:RootState)=>state.article.list)
  return(
    <div className="article-list-page">
      <CategoryTabs/>
     <Card title="文章列表">
     {
      articles.length>0?
      articles.map(item=>(<ArticleCard key={item.id} article={item}/>)):<Empty description="暂无文章"/>
     }
     <Pagination className="pagination" current={page} total={50} pageSize={10} onChange={(page)=>setPage(page)}/>

     </Card>
    </div>
  )
}