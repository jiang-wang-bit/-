import {Card,Button,Tag} from "antd"
import "./index.scss"
import { useNavigate } from "react-router-dom";
interface Props{
  article:{
    id:number
    title:string;
    desc:string,
    author:string,
    createTime:string,
    category?:string;
    views?:number
  }
}
export default function ArticleCard({article}:Props){
  const navigate = useNavigate()
  return(
   <Card className="article-card" hoverable>
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
        {article.createTime}
        </span>

        </div>

        <div className="article-bottom">
          {article.category&&
          <Tag color="blue">{article.category}</Tag>}

          {article.views&&<span>阅读量:{article.views}</span>}
        </div>
         
         <div className="article-action">
        <Button type="link" onClick={()=>navigate(`/article/${article.id}`)}>查看详情</Button>
         </div>

   </Card>
  )
}