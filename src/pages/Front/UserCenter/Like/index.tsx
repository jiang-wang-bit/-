import {Card,Empty,Button,Space} from "antd"
import { getUserLikes } from "../../../../api/user"
import { useEffect,useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../../../store"
export default function MyLikes(){
  const navigate = useNavigate()
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  const [articles,setArticles] = useState<any[]>([])
  useEffect(()=>{
     if(!userInfo?.id){
      return
     }
     getUserLikes().then(res=>{
      setArticles(res)
     })
  },[userInfo?.id])

  return(
    <div>
    <Card title="点赞文章">
      {
        articles.length===0?<Empty description="暂无喜欢"/>:
        <Space vertical style={{width:"100%"}}>
            {
              articles.map(item=>(
                <Card key={item.id}>
                   <h3>标题: {item.title}</h3>
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