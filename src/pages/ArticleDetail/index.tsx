import { useParams } from "react-router-dom"
import "./index.scss"
import CommentList from "../../components/CommentList";
import { useSelector } from "react-redux"
import {Card,Typography,Tag,Avatar,Space,Divider} from "antd"
import {
 UserOutlined,
 CalendarOutlined
} from "@ant-design/icons";
import CommentInput from "../../components/CommentInput";
import ReactMarkdown from "react-markdown"
import "github-markdown-css/github-markdown.css";
interface Article{
  id:number;
  title:string;
  category:string;
  content:string;
  status:string;
  author:string;
  time:string;
}
const {Title} = Typography
export default function ArticleDetail(){

   const {id}= useParams()
   const articles = useSelector((state:any)=>state.article.list as Article [])
   const article = articles.find(item=>item.id===Number(id))
   if(!article){
    return(
      <Card>文章不存在</Card>
    )
   }

   return (
    <div className="article-detail">
      <Card>
        {/* 标题 */}
        <Title level={1}>{article.title}</Title>
        <div className="article-meta">
        <Space size="large">
         <Space>
          <Avatar icon={<UserOutlined />} />
          {article.author}
         </Space>

         <Tag color="blue">{article.category}</Tag>

        <Space>
          <CalendarOutlined />{article.time}
        </Space>
        </Space>
        </div>

        <Divider/>

        {/* 正文 */}
        <div className="markdown-body">
          <ReactMarkdown>
            {article.content}
          </ReactMarkdown>
        </div>

        <Divider/>
        <CommentInput articleId={article.id} articleTitle={article.title}/>
        <CommentList articleId={article.id} />

      </Card>
    </div>
  )
}