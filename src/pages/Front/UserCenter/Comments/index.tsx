import { Card, Empty, Space, Button, Tag } from "antd"
import { useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { getMyComments } from "../../../../api/comment"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../../../store"
import "./index.scss"

export default function MyComments() {
  const navigate = useNavigate()
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  // 当前用户评论
  const [comments,setComments] = useState<any[]>([])
  useEffect(()=>{
   if(!userInfo?.id){
    return
   }
   getMyComments().then(res=>{
    setComments(res)
   })
  },[userInfo?.id])
  return(
    <div>
      <Card title="我的评论" className="my-comments">
       
    {
      comments.length===0
      ?
      <Empty
        description="暂无评论"
      />
      :
      <Space
       vertical
        size="middle"
        className="comment-space"
      >

      {
        comments.map(item=>(


          <Card
            key={item.id}
            className="comment-item"
          >


            <div className="comment-top">


              <span>
                文章：
                {item.articleTitle}
              </span>


              <Tag
              color={
                item.status==="normal"
                ?
                "green"
                :
                "orange"
              }
              >

              {item.status}

              </Tag>


            </div>



            <div className="comment-content">

             评论：{item.content}

            </div>


            <div className="comment-bottom">


              <span>
                {item.time}
              </span>


              <Button
              type="link"
              onClick={()=>navigate(
                `/article/${item.articleId}`
              )}
              >

              查看文章

              </Button>


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