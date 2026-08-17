import "./index.scss"
import {Card,Empty,Pagination,Input} from "antd"
import { useState,useEffect } from "react"
import {useSelector} from "react-redux"
import {useSearchParams} from "react-router-dom"
import { getArticleList } from "../../../api/article"
import CategoryTabs from "../../Home/components/CategoryTabs"
import type { RootState } from "../../../store"
import type { ArticleType } from "../../../types/article"
import ArticleCard from "../../Home/components/ArticleCard"
export default function ArticleList(){
  const [page,setPage] = useState(1)
  const [params] = useSearchParams()
  const keywordFromUrl = params.get("keyword") || ""
   const [keyword,setKeyword] = useState(keywordFromUrl)
  const [category,setCategory]=useState<number | null>(null)
  const [articles,setArticles] = useState<ArticleType[]>([])
   useEffect(()=>{
  setKeyword(
   params.get("keyword") || ""
  )
 },[params])

 useEffect(()=>{
  getArticleList().then(res=>{
    setArticles(res.filter(item=>item.status==="published"))
  })
 },[])

  const filterData = articles.filter(item=>{
    const matchKeyword = keyword.trim()?(item.title.includes(keyword) )|| (item.content.includes(keyword)):true
    const matchCategory = category?(item.categoryId)===(category):true
    return (matchKeyword&&matchCategory)
  })
  const pageData = filterData.slice((page-1)*10,page*10)
  return(
    <div className="article-list-page">
      <div className="articlelist-title">
      <CategoryTabs onChange={(id)=>{setCategory(id); setPage(1)}}/>
      <Input placeholder="搜索文章" value={keyword} onChange={(e)=>{setKeyword(e.target.value)
        setPage(1)
      }} style={{width:300}}/>
      </div>

     <Card title="文章列表">
     {
      pageData.length>0?
      pageData.map(item=>(<ArticleCard key={item.id} article={item}/>)):<Empty description="暂无文章"/>
     }
     <Pagination className="pagination" current={page} total={filterData.length} pageSize={10} onChange={(page)=>setPage(page)}/>

     </Card>
    </div>
  )
}