import {Table,Button,Tag,Space} from "antd"
import './index.scss'
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
export default function Article(){
  const navigate = useNavigate()
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
      dataIndex:"catogory",
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
      dataIndex:"time"
    },
    {
      title:"操作",
      render:()=>(
        <Space>
        <Button type="link">
        编辑
        </Button>
        <Button danger type="link">
          删除
        </Button>

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