import {Card,Button,Tag} from "antd"
import "./index.scss"
import { useNavigate } from "react-router-dom";
import {useState,useEffect} from "react"
import dayjs from "dayjs"
import {getCategoryList} from "../../../../api/category"
import type { CategoryType } from "../../../../types/category"
interface Props{
  article:{
    id:number
    title:string;
    desc?:string,
    author:string,
    cover:string,
    createTime:string,
    categoryId:number;
    category?:string;
    views?:number
  }
}
export default function ArticleCard({article}:Props){
  const navigate = useNavigate()
  const [categories,setCategories] = useState<CategoryType[]>([])
  useEffect(()=>{
      getCategoryList().then(res=>{
         console.log("分类数据",res)
        setCategories(res.list)
      })
  },[])
  const category = categories.find(item=>item.id===article.categoryId)
  return(
   <Card className="article-card" hoverable cover={article.cover&&<img src={article.cover} className="article-cover" alt={article.title}/>}>
     <h3>
      {article.title}
      </h3>

      <p className="desc">
      {article.desc}
      </p>

       <div className="article-meta">

        <span>
        作者：
        {article.author}
        </span>

        <span>
        {dayjs(article.createTime).format("YYYY-MM-DD")}
        </span>

        </div>

        <div className="article-bottom">
          {category&&
          <Tag color="blue">{category.name}</Tag>}

          {article.views!==undefined&&<span>阅读量:{article.views}</span>}
        </div>
         
         <div className="article-action">
        <Button type="link" onClick={()=>navigate(`/article/${article.id}`)}>查看详情</Button>
         </div>

   </Card>
  )
}