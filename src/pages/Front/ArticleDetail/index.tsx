import {Card,Tag,Button,message} from "antd"
import CommentList from "../../../components/CommentList"
import CommentInput from "../../../components/CommentInput"
import {useSelector} from "react-redux"
import {useEffect} from "react"
import { getArticleDetail,getArticleList,getLikeStatus,unlikeArticle,likeArticle,getFavoriteStatus,unfavoriteArticle,favoriteArticle,increaseArticleView,addHistory} from "../../../api/article"
import ReactMarkdown from "react-markdown"
import "./index.scss"
import { useParams,useNavigate } from "react-router-dom"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import {getCategoryList} from "../../../api/category"
import type { ArticleType } from "../../../types/article"
import type { CategoryType } from "../../../types/category"
import type { RootState } from "../../../store"
export default function ArticleDetailFront(){
  const {id} = useParams()
  const location = useLocation()
  const isPreview = location.pathname.includes("/preview")
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  const navigate = useNavigate()
    // 文章点赞
    const [liked,setLiked] = useState(false)
    const [likeCount,setLikeCount] = useState(0)
    // 文章收藏
    const [favorited,setFavorited] = useState(false)
    const [categories,setCategories] = useState<CategoryType[]>([])
    const [articles,setArticles] = useState<ArticleType[]>([])
    const visibleArticles = articles.filter(item=>item.status==="published")
    const [article,setArticle] = useState<ArticleType|null>(null)
  //  获取文章
     useEffect(()=>{
     if(!id) return
     getArticleDetail(Number(id)).then(res=>{
      console.log(
"文章详情返回:",
res
)
      setArticle(res)

      }).catch(err=>{
        console.log("获取文章失败",err)
      })
    },[id])
    // 获取分类以及所有文章
    useEffect(()=>{
          getCategoryList().then(res=>{ 
            setCategories(res.list)
          })
          getArticleList({page:1,pageSize:6}).then(res=>
          {
            setArticles(res.list)
          }
          )
      },[])
     // 文章点赞+点赞
     useEffect(()=>{
        if(!article||!userInfo?.id) return
        Promise.all([getLikeStatus(article.id),getFavoriteStatus(article.id)]).then(([like,favorite])=>{
          setLiked(like.liked)
          setLikeCount(like.count)
          setFavorited(favorite.favorited)
    
        })
     },[article,userInfo])

    //  增加阅读量
   useEffect(()=>{


        if(
        !id || isPreview ||!userInfo?.id){
        return
        }

        const key=
        `article_view_${id}`

        const viewed =
        localStorage.getItem(key)

        if(!viewed){
        increaseArticleView(
        Number(id)).then(res=>{
        setArticle(prev=>{

        if(!prev)
        return prev


        return{
        ...prev,
        views:res.views
        }


        })


        localStorage.setItem(
        key,
        "true"
        )


        })

        }


       },[
        id,isPreview])


        // 阅读历史
        useEffect(()=>{
        if(
        !article ||
        !userInfo?.id
        ){
        return
        }


        addHistory(
        article.id
        )


        },[
        article,
        userInfo?.id
        ])

     if (!article) {
    return <Card>文章不存在</Card>
      }
    if((article.status==="draft"||article.status==="offline")&&!isPreview&&userInfo?.role!=="admin"){
      return(
        <Card>文章不存在</Card>
      )
    }
    // 获取相关文章
  const recommendArticles = articles.filter(item=>item.categoryId===article?.categoryId && item.id!==article?.id&&item.status==="published").slice(0,3)
  //  获取当前文章位置
 const currentIndex = visibleArticles.findIndex(item=>item.id===article?.id)
 const prevArticle = visibleArticles[currentIndex-1]
 const nextArticle = visibleArticles[currentIndex+1]
 const category = categories.find(item=>item.id===article?.categoryId)
  return(
    <div className="article-detail">
      <Card>
        <div className="article-cover-wrapper">
         {
          article.cover&&
          <img src={article.cover} className="artilce-cover" /> 
        }
        </div>
        {/* 标题 */}
        <h1>
     {article.title}
        </h1>

        {/* 预览模式 */}
        {
         isPreview&&
          <div className="preview-wrapper">
          <Tag color="orange" className="tag-preview">预览模式</Tag>
          <Button type="link" onClick={()=>navigate("/admin/article")}>退出预览</Button>
        </div>
        }


        {/* 收藏按钮 */}
        <Button type={favorited?"primary":"default"} onClick={async()=>{
          if(!userInfo?.id){
            message.warning("请先登录")
            return
          }
          if(favorited){
            const res = await unfavoriteArticle(article.id)
            setFavorited(res.favorited)
          }else{
            const res = await favoriteArticle(article.id)
            setFavorited(res.favorited)
          }
        }}>
          {favorited?"❤️ 已收藏":"🤍 收藏文章"}
        </Button>

         {/* 点赞按钮 */}
         <Button type={liked?"primary":"default"} onClick={async()=>{
           if(!userInfo?.id){
              message.warning("请先登录")
              return
            }
           if(liked){
            const res = await unlikeArticle(article.id)
            setLiked(false)
            setLikeCount(res.count)
           }
           else{
            const res = await likeArticle(article.id)
            setLiked(true)
            setLikeCount(res.count)
          }
         }}>
          👍{liked?"已点赞":"点赞"}
          ({likeCount})
         </Button>

        <div className="article-info">
        <span>
        作者：
        {article.author}
        </span>

        <span>
        发布时间：
        {article.createTime}
        </span>

        <span>
        阅读量：
        {article.views}
        </span>

        <Tag color="blue">
        {category?.name}
        </Tag>

        </div>

        <div className="article-content">
        {
        <ReactMarkdown>
          {article.content}
        </ReactMarkdown>
        }
        </div>

      </Card>

      <div className="article-switch">
        <Button disabled={!prevArticle} onClick={()=>{if(prevArticle) navigate(isPreview?`/article/${prevArticle.id}/preview`:`/article/${prevArticle.id}`)}}>上一篇</Button>
        <Button disabled={!nextArticle} onClick={()=>{if(nextArticle) navigate(isPreview?`/article/${nextArticle.id}/preview`:`/article/${nextArticle.id}`)}}>下一篇</Button>
      </div>

      {/* 相关文章推荐 */}
      <Card title="相关文章推荐" className="recommend-card">
       {
        recommendArticles.length>0?recommendArticles.map(item=>(
          <div key={item.id} className="recommend-item" onClick={()=>navigate(isPreview?`/article/${item.id}/preview`:`/article/${item.id}`)}>
            {item.title}
          </div>
        )) : <p>暂无相关文章</p>
       }
      </Card>
     {!isPreview&&
      <div className="comment-area">
       <CommentInput articleId={article.id} articleTitle={article.title}/>
       <CommentList articleId={article.id}/>
       </div>
     }
    </div>
  )
}