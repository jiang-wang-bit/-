import {Table,Button,Tag,Space,Popconfirm,Input,Select,Dropdown, message} from "antd"
import './index.scss'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { deleteArticle } from "../../store/modules/article"
import { useState,useEffect} from "react"
import { publishArticle,offlineArticle } from "../../store/modules/article"
import { getCategoryList } from "../../api/category"
import type { CategoryType } from "../../types/category"
import type { ArticleType } from "../../types/article"
import dayjs from "dayjs"
export default function Article(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [keyword,setKeyword] = useState("")
  const [statusFilter,setStatusFilter] = useState("")
  const [category,setCategory] = useState("")
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  // 批量删除
  const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])
  // 批量删除函数
  const handleBatchDelete = ()=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择文章")
      return
    }
    selectedRowKeys.forEach(id=>{
      dispatch(deleteArticle(id))
    })
    message.success(`删除${selectedRowKeys.length}篇文章成功`)
    setSelectedRowKeys([])
  }

// 批量发布函数
const handleBatchPublish = ()=>{
  if(selectedRowKeys.length===0){
    message.warning("请选择文章")
    return
  }
  selectedRowKeys.forEach(id=>{
    dispatch(publishArticle(id))
  })
   message.success(
  "批量发布成功")
 setSelectedRowKeys([])
}

// 批量下架函数
const handleBatchOffline = ()=>{
  if(selectedRowKeys.length===0){
    message.warning("请选择文章")
    return
  }
  selectedRowKeys.forEach(id=>{
    dispatch(offlineArticle(id))
  })
  message.success(`成功下架${selectedRowKeys.length}篇文章`)
  setSelectedRowKeys([])
}


  const [categories,setCategories] = useState<CategoryType[]>([])
  const data= useSelector((state:any)=>state.article.list) as ArticleType []

  useEffect(()=>{
    // Assuming you have a function to fetch categories
    getCategoryList().then(res=>setCategories(res))
  },[])

  const filterData = data.filter(item=>{const matchKeyword = item.title.includes(keyword)
     const matchCategory = category ?String(item.categoryId)===String(category):true
     const matchStatus = statusFilter?item.status===statusFilter:true
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
      dataIndex:"title",
      render:(title:string,record:any)=>(
        <Button onClick={()=>navigate(`/article/${record.id}`)}>{title}</Button>
      )
    },
    {
      title:"作者",
      dataIndex:"author"
    },
    {
      title:"分类",
      dataIndex:"categoryId",
      render:(categoryId:number)=>{
        const category = categories.find(item=>item.id===categoryId)
        return (
          <Tag color="blue">
            {category?.name}
          </Tag>
        )
      }
    },
    {
     title:"状态",
     dataIndex:"status",
     render:(text:string)=>{
      let color = ""
      let label = ""
      switch(text){
        case "published":
          color="green"
          label="已发布"
          break;
        case "draft":
          color="orange"
          label="草稿"
          break;
        case "offline":
          color="red"
          label="已下架"
          break;
      }
         return(
        <Tag color={color}>{label}</Tag>
      )
     }
    },
    {
      title:"发布时间",
      dataIndex:"createTime",
      render:(createTime:string)=>{
        return dayjs(createTime).format("YYYY-MM-DD")
      }
    },
    {
      title:"操作",
      render:(record:any)=>{
       const actionItems = [
        {
          key:"preview",
          label:"预览"
        },
        {
          key:"edit",
          label:"编辑"
        },
        {
          key:"delete",
          label:"删除"
        },
        record.status==="draft"?
        {
          key:"publish",
          label:"发布"
        }:
        {
          key:"unpublish",
          label:"下架"
        }
       ]
       
       const handleAction = ({key}:any)=>{
        if(key==="preview"){
          navigate(`/article/preview/${record.id}`)
        }
        if(key==="edit"){
          navigate(`/admin/article/edit/${record.id}`)
        }
        if(key==="publish"){
          dispatch(publishArticle(record.id))
        }
        if(key==="unpublish"){
          dispatch(offlineArticle(record.id))
        }
        if(key==="delete"){
          dispatch(deleteArticle(record.id))
        }
       }
       return(
        <Dropdown menu={{items:actionItems,onClick:handleAction}}>
           <Button size="small">更多 ▼</Button>
        </Dropdown>
       )
      }
    }
   ]


  return (
    <div className="article-page">
      <div className="article-header">
        <h2>文章管理</h2>
        <Input placeholder="搜索文章标题" value={keyword} onChange={e=>{setKeyword(e.target.value) 
          setPage(1)}} style={{width:"400px"}}></Input>
        <Select placeholder="选择分类" allowClear options={categories.map(item=>({label:item.name,value:item.id}))} onChange={value=>{setCategory(value||"")
          setPage(1)
        }}></Select>
        <Select placeholder="文章状态" allowClear options={[{label:"发布",value:"发布"},{label:"草稿",value:"草稿"}]} onChange={value=>{setStatusFilter(value||"")
          setPage(1)
        }}></Select>
        <Button type="primary" onClick={()=>navigate("/admin/article/create")}>新增文章</Button>
        {
          selectedRowKeys.length>0&&
          <div className="batch-action">
            <span>已选择{selectedRowKeys.length}篇文章</span>
            <Popconfirm title="确定批量删除吗" onConfirm={handleBatchDelete}>
              <Button danger>批量删除</Button>
            </Popconfirm>
            <Button type="primary" onClick={handleBatchPublish}>批量发布</Button>
            <Button onClick={handleBatchOffline}>批量下架</Button>
          </div>
        }
      </div>
    <Table columns={columns} dataSource={tableData} rowKey="id" pagination={{current:page,pageSize:pageSize,total:filterData.length,onChange:(page,pageSize)=>{setPage(page)
      setPageSize(pageSize)}}} rowSelection={{selectedRowKeys,
        onChange:(keys)=>{
         setSelectedRowKeys(
     keys.map(key=>Number(key))
   )
      }}}/>
     </div>

  )

}