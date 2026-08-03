import {Card,Empty,Button,Space} from "antd"
import { useSelector, UseSelector } from "react-redux"
import type { RootState } from "../../../../store"
import { useNavigate } from "react-router-dom"
import "./index.scss"
export default function Favorite() {
  const navigate = useNavigate()
  // 收藏id
  const favoriteIds = useSelector((state:RootState)=>state.favorite.list)
  // 所有文章
  const articles = useSelector((state:RootState)=>state.article.list)
  // 收藏文章
  const favoriteArticles = articles.filter(item=>favoriteIds.includes(item.id))
  return(
    <div>
    <Card title="收藏文章">
      {
        favoriteArticles.length===0?<Empty description="暂无收藏"/>:
        <Space vertical style={{width:"100%"}}>
            {
              favoriteArticles.map(item=>(
                <Card key={item.id}>
                   <h3>{item.title}</h3>
                   <p>{item.content.slice(0,100)}</p>
                   <Button type="link" onClick={()=>navigate(`/article/${item.id}`)}>
                  查看文章 </Button>
                </Card>
              ))
            }
        </Space>
      }
    </Card>
    </div>
  )
}