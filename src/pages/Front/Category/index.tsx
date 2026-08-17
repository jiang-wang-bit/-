import {Card,Tag} from "antd"
import {useNavigate} from "react-router-dom"
import { useEffect,useState } from "react"
import type { CategoryType,CategoryStatsType } from "../../../types/category"
import { getCategoryList,getCategoryStats } from "../../../api/category"
import type { RootState } from "../../../store"
import { useSelector } from "react-redux"
import "./index.scss"
export default function MyCategory(){
  const navigate = useNavigate()
  const [categories,setCategories] = useState<CategoryStatsType[]>([])
  const articles = useSelector((state:RootState)=>state.article.list).filter(item=>item.status==="published")
  useEffect(()=>{
   getCategoryStats().then(res=>{
    setCategories(res)
   })
  },[])
  return (
    <div className="category-page">
      <Card title="文章分类">
      <div className="category-list">
       {
        categories.map(item=>{

          return(

          <Card
          className="category-item"
          key={item.id}
          hoverable
          onClick={()=>{
          navigate(
          `/category/${item.id}`
          )
          }}
          >
            
          <div className="category-left">

          <div className="category-name">
          {item.name}
          </div>


          <div className="category-desc">
          共有
          <Tag color="blue">
          {item.article_count}
          </Tag>
          篇文章
          </div>

          </div>

          <div className="category-arrow">
          进入 →
          </div>

          </Card>
          )
        })
       }
      </div>
      </Card>
    </div>
  )
}