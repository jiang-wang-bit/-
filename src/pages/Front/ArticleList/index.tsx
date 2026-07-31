import "./index.scss"
import {Card,Empty,Pagination} from "antd"
import { useState } from "react"
import ArticleCard from "../../Home/components/ArticleCard"
export default function ArticleList(){
  const [page,setPage] = useState(1)
  const articles=[
{
 id:1,

 title:"React Hooks详解",

 desc:"深入理解useState和useEffect",

 author:"admin",

 createTime:"2026-07-31",

 category:"React",

 views:1000

},



{
 id:2,

 title:"TypeScript入门",

 desc:"从JavaScript到TypeScript",

 author:"admin",

 createTime:"2026-07-30",

 category:"TypeScript",

 views:800

},



{
 id:3,

 title:"Webpack原理",

 desc:"深入理解Webpack打包流程",

 author:"admin",

 createTime:"2026-07-29",

 category:"工程化",

 views:500

}

]
  return(
    <div className="article-list-page">
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