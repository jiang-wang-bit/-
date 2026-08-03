import {Table,Button,Space,Tag,Popconfirm} from "antd"
import { UseSelector,useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../../../store"
import { deleteArticle } from "../../../../store/modules/article"
import { render } from "@testing-library/react"
export default function MyArticles() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 当前用户
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  // 所有文章
  const articles = useSelector((state:RootState)=>state.article.list)
  // 自己的文章
  const myArticles = articles.filter(item=>item.author===userInfo?.username)
  const columns = [
    {
      title:"标题",
      dataIndex:"title"
    },
    {
      title:"分类",
      dataIndex:"category"
    },
    {
      title:"状态",
      dataIndex:"status",
      render:(text:string)=>(
        <Tag color={text==="发布"?"green":"orange"}>{text}</Tag>
      )
    },
    {
      title:"操作",
      render:(record:any)=>(
        <Space>
          <Button type="link" onClick={()=>navigate(`/user/articles/edit/${record.id}`)}>编辑</Button>

          <Popconfirm title="确定删除吗" onConfirm={()=>dispatch(deleteArticle(record.id))}>
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]
  return(
    <div className="article-page">
      <Table columns={columns} rowKey="id" dataSource={myArticles}>
      </Table>
    </div>
  )
}