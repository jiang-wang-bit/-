import {Table,Button,Tag,Space} from "antd"
import './index.scss'

export default function Article(){
  const data=[


   {
 id:1,

 title:"React后台管理系统",

 author:"admin",

 category:"React",

 status:"发布",

 time:"2026-07-25"

  },



{
 id:2,

 title:"FastAPI学习笔记",

 author:"admin",

 category:"Python",

 status:"草稿",

 time:"2026-07-24"

}


]
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
        <Button type="primary">新增文章</Button>
      </div>
    <Table columns={columns} dataSource={data} rowKey="id" />
     </div>

  )

}