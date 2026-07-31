import {Card} from "antd"
import "./index.scss"
interface Props{
  article:{
    title:string;
    desc:string,
    author:string,
    createTime:string
  }
}
export default function ArticleCard({article}:Props){
  return(
   <Card className="article-card" hoverable>
     <h3>
      {article.title}
      </h3>

      <p>
      {article.desc}
      </p>


      <div>
      作者：
      {article.author}
      </div>


      <div>
      {article.createTime}
      </div>
   </Card>
  )
}