import {Card,Empty,Button,Space,Tag} from "antd"
import { getHistory } from "../../../../api/article";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";

export default function History(){
  const navigate = useNavigate()
  const [articles,setArticles] = useState<any[]>([])
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  useEffect(()=>{
   if(!userInfo?.id){
    return
   }
   getHistory().then(res=>{
    setArticles(res)
   })
  },[userInfo?.id])
  return(
      <div>
    <Card title="阅读历史">
      {
        articles.length===0?<Empty description="暂无阅读记录"/>:
        <Space vertical style={{width:"100%"}}>
            {
              articles.map(item=>(
                <Card key={item.id}>
                   <h3>标题: {item.title}</h3>
                   <p>{item.content.slice(0,100)}</p>
                   <div className="history-bottom">
                    {/* <Tag color="blue">{item.category?.name}</Tag> */}
                   <Button type="link" onClick={()=>navigate(`/article/${item.id}`)}>
                  继续阅读 </Button>
                  </div>
                </Card>
              ))
            }
        </Space>
      }
    </Card>
    </div>
  )
}