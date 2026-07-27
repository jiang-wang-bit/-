import { useParams } from "react-router-dom"
import "./index.scss"
import { useSelector, UseSelector } from "react-redux"
interface Article{
  id:number;
  title:string;
  category:string;
  content:string;
  status:string;
  author:string;
  time:string;
}
export default function ArticleDetail(){

   const {id}= useParams()
   const articles = useSelector((state:any)=>state.article.list as Article [])
   const article = articles.find(item=>item.id===Number(id))
   if(!article){
    return(
      <div>文章不存在</div>
    )
   }

   return (
    <div className="文章详情页">
      <h1>{article.title}</h1>

      <div className="article-info">
           <span>作者:{article.author}</span>
           <span>分类:{article.category}</span>
           <span>发布时间:{article.time}</span>
      </div>

      <div className="article-content">
         {article.content}
      </div>
    </div>
  )
}