import {Table,Button,Tag,Space,Popconfirm} from "antd"
import './index.scss'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteArticle } from "../../store/modules/article"
import dayjs from "dayjs"
export default function Article(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const data= useSelector((state:any)=>state.article.list)

   const columns=[
    {
      title:"ID",
      dataIndex:"id"
    },
    {
      title:"文章标题",
      dataIndex:"title"
    },
    {
      title:"作者",
      dataIndex:"author"
    },
    {
      title:"分类",
      dataIndex:"category",
      render:(text:string)=>(
        <Tag color={"blue"}>
          {text}
        </Tag>
      )
    },
    {
     title:"状态",
     dataIndex:"status",
     render:(text:string)=>(
      <Tag color={text==="发布"?"green":"orange"}>
        {text}
      </Tag>
     )
    },
    {
      title:"发布时间",
      dataIndex:"time",
      render:(time:string)=>{
        return dayjs(time).format("YYYY-MM-DD")
      }
    },
    {
      title:"操作",
      render:(record:any)=>(
        <Space>
        <Button type="link" onClick={()=>navigate(`/admin/article/edit/${record.id}`)}>
        编辑
        </Button>
        <Popconfirm title="确定删除这篇文章吗" onConfirm={()=>dispatch(deleteArticle(record.id))}>
        <Button danger type="link">
          删除
        </Button>
        </Popconfirm>

        </Space>
      )
    }
   ]


  return (
    <div className="article-page">
      <div className="article-header">
        <h2>文章管理</h2>
        <Button type="primary" onClick={()=>navigate("/admin/article/create")}>新增文章</Button>
      </div>
    <Table columns={columns} dataSource={data} rowKey="id" />
     </div>

  )

}