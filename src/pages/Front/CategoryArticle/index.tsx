import {useParams,useNavigate} from "react-router-dom"
import{Card,Empty,Tag} from "antd"
import { useState,useEffect } from "react"
import { getCategoryDetail } from "../../../api/category"
import { getArticleList } from "../../../api/article"
import { getCategoryArticles } from "../../../api/category"
import type { CategoryType } from "../../../types/category"
import type {ArticleType} from "../../../types/article"
export default function CategoryArticle(){
  const {id} = useParams()
  const navigate = useNavigate()
  const [articles,setArticles] = useState<ArticleType[]>([])
  const [category,setCategory] = useState<CategoryType|null>(null)
 useEffect(()=>{

    if(!id) return


    const categoryId = Number(id)


    getCategoryDetail(categoryId)
    .then(res=>{

        setCategory(res)

    })


    getCategoryArticles(categoryId)
    .then(res=>{

        setArticles(
            res.articles
        )

    })


},[id])
  const categoryArticles = articles
  return(
    <div className="category-article-page">


<Card
className="category-header"
>

<h1>
{category?.name}
</h1>

<p>
共有 {categoryArticles.length} 篇文章
</p>


</Card>



<div className="article-list">


        {

        categoryArticles.length===0?

        <Empty
        description="暂无文章"
        />


        :

        categoryArticles.map(item=>(
        <Card

        key={item.id}

        hoverable

        className="article-card"

        onClick={()=>{

        navigate(
        `/article/${item.id}`
        )

        }}

        >

        <h2>
        {item.title}
        </h2>


        <p>

        {
          item.content?
        item.content.slice(0,120):""}

        ...

        </p>


        <div>


        <Tag color="blue">

        {category?.name}

        </Tag>


        <span>

        阅读量:
        {item.views}

        </span>


        </div>


        </Card>


        ))


        }

        </div>

        </div>


)
} 