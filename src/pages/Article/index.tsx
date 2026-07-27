import {Table,Button,Tag,Space,Popconfirm,Input,Select} from "antd"
import './index.scss'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteArticle } from "../../store/modules/article"
import { useState } from "react"
import dayjs from "dayjs"
export default function Article(){
  interface Article {
  id:number;
  title:string;
  category:string;
  content:string;
  status:string;
  author:string;
  time:string;
}
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [keyword,setKeyword] = useState("")
  const [status,setStatus] = useState("")
  const [category,setCategory] = useState("")
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const data= useSelector((state:any)=>state.article.list) as Article []

  const filterData = data.filter(item=>{const matchKeyword = item.title.includes(keyword)
     const matchCategory = category ? item.category===category:true
     const matchStatus = status?item.status===status:true
     return (matchKeyword&&matchCategory&&matchStatus)
})
  const tableData = filterData.slice((page-1)*pageSize,page*pageSize)
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
        <Input placeholder="搜索文章标题" value={keyword} onChange={e=>setKeyword(e.target.value)} style={{width:"400px"}}></Input>
        <Select placeholder="选择分类" allowClear options={[{label:"React",value:"React"},{label:"python",value:"python"},{label:"vue",value:"vue"}]} onChange={value=>setCategory(value||"")}></Select>
        <Select placeholder="文章状态" allowClear options={[{label:"发布",value:"发布"},{label:"草稿",value:"草稿"}]} onChange={value=>setStatus(value||"")}></Select>
        <Button type="primary" onClick={()=>navigate("/admin/article/create")}>新增文章</Button>
      </div>
    <Table columns={columns} dataSource={tableData} rowKey="id" pagination={{current:page,pageSize:pageSize,total:filterData.length,onChange:(page,pageSize)=>{setPage(page)
      setPageSize(pageSize)}}}/>
     </div>

  )

}