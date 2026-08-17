import { useParams } from "react-router-dom"
import "./index.scss"
import CommentList from "../../components/CommentList";
import { useSelector } from "react-redux"
import { getArticleDetail } from "../../api/article";
import { getCategoryList } from "../../api/category";
import { useState,useEffect } from "react";
import {Card,Typography,Tag,Avatar,Space,Divider} from "antd"
import {
 UserOutlined,
 CalendarOutlined
} from "@ant-design/icons";
import CommentInput from "../../components/CommentInput";
import ReactMarkdown from "react-markdown"
import "github-markdown-css/github-markdown.css";
import type { ArticleType } from "../../types/article";
import { CategoryType } from "../../types/category";
const {Title} = Typography
export default function ArticleDetail(){

   const {id}= useParams()
  //  const articles = useSelector((state:any)=>state.article.list as ArticleType [])
  //  const article = articles.find(item=>item.id===Number(id))
  //  获取文章
  const [article,setArticle] = useState<ArticleType|null>(null)
  useEffect(()=>{
   if(!id) return
   getArticleDetail(Number(id)).then(res=>
    setArticle(res)
   )
  },[id])
  //  分类
  const [categories,setCategories] = useState<CategoryType[]>([])
  useEffect(()=>{
   getCategoryList().then(res=>{
    setCategories(res.list)
   }
   )
  },[])
  const category = categories.find(item=>item.id===article?.categoryId)
   if(!article){
    return(
      <Card>加载中...</Card>
    )
   }

   return (
    <div className="article-detail">
      <Card>
        {/* 封面图 */}
        {
          article.cover&&
          <img src={article.cover} className="artilce-cover"/> 
        }
        {/* 标题 */}
        <Title level={1}>{article.title}</Title>
        <div className="article-meta">
        <Space size="large">
         <Space>
          <Avatar icon={<UserOutlined />} />
          {article.author}
         </Space>

         <Tag color="blue">{category?.name}</Tag>

        <Space>
          <CalendarOutlined />{article.createTime}
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