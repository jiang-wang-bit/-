import {Table,Button,Tag,Space,Popconfirm,Input,Select,Dropdown, message} from "antd"
import './index.scss'
import { useNavigate } from "react-router-dom"
import { useState,useEffect,useMemo} from "react"
import { getCategoryList } from "../../api/category"
import { getArticleList,updateArticleStatus} from "../../api/article"
import type { CategoryType } from "../../types/category"
import type { ArticleType } from "../../types/article"
import type { MenuProps } from "antd"
import type { RootState } from "../../store"
import dayjs from "dayjs"
export default function Article(){
  const navigate = useNavigate()
  const [keyword,setKeyword] = useState("")
  const [statusFilter,setStatusFilter] = useState("")
  const [category,setCategory] = useState("")
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const loadArticles = ()=>{
  getArticleList().then(res=>
    setData(res)
  )
}
  // 批量删除
  const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])
  // 批量删除函数
  const handleBatchDelete =async ()=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择文章")
      return
    }
   for(const id of selectedRowKeys){
    await updateArticleStatus(id,"trash")
   }
    message.success(`删除${selectedRowKeys.length}篇文章成功`)
    loadArticles()
    setSelectedRowKeys([])
  }

// 批量发布函数
const handleBatchPublish = async()=>{
  if(selectedRowKeys.length===0){
    message.warning("请选择文章")
    return
  }
  for(const id of selectedRowKeys){
    await updateArticleStatus(id,"published")
  }
  message.success("批量发布成功")
  loadArticles()
  setSelectedRowKeys([])
}

// 批量下架函数
const handleBatchOffline = async()=>{
  if(selectedRowKeys.length===0){
    message.warning("请选择文章")
    return
  }
  for(const id of selectedRowKeys)
  {
    await updateArticleStatus(id,"offline")
  }
  message.success(`成功下架${selectedRowKeys.length}篇文章`)
  loadArticles()
  setSelectedRowKeys([])
}


  const [categories,setCategories] = useState<CategoryType[]>([])
  const [data,setData] = useState<ArticleType[]>([])
  // const data= useSelector((state:RootState)=>state.article.list).filter(item=>item.status!=="trash")
  const selectedArticles = useMemo(()=>{
    return data.filter(item=>selectedRowKeys.includes(item.id))
  },[data,selectedRowKeys])
  // 判断发布
  const canPublish = useMemo(()=>{
    return selectedArticles.some(
    item=>item.status==="draft" ||
    item.status==="offline"
    )
  },[selectedArticles])

  // 判断下架
  const canOffline = useMemo(()=>{
   return selectedArticles.some(
 item=>item.status==="published"
)
  },[selectedArticles])
  // 删除
 const canDelete = selectedArticles.length>0

//  多篇操作
 const batchItems:MenuProps["items"]=useMemo(()=>{
  const items:MenuProps["items"]= []
   if(canPublish){
      items.push({
        key:"publish",
        label:"批量发布"
      })

      }
      if(canOffline){

      items.push({
        key:"offline",
        label:"批量下架"
      })

      }
      if(canDelete){

      items.push({
        key:"delete",
        label:"批量删除"
      })
      }
      return items

 },[canPublish,canOffline,canDelete])

  useEffect(()=>{
    // Assuming you have a function to fetch categories
    getCategoryList().then(res=>setCategories(res))
    loadArticles()
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
        case "trash":
          color="gray"
          label="回收站"
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
     const actionItems:any[]=[
        {
          key:"edit",
          label:"编辑"
        }
      ]
      if(record.status==="draft"){
        actionItems.push(
          {
            key:"preview",
            label:"预览"
          },
          {
            key:"publish",
            label:"发布"
          }
        )
      }
      if(record.status==="published"){
        actionItems.push({
          key:"offline",
          label:"下架"
        })
      }
      if(record.status==="offline"){
        actionItems.push(
          {
            key:"preview",
            label:"预览"
          },
          {
            key:"publish",
            label:"重新发布"
          }
        )
      }
      actionItems.push({
        key:"delete",
        label:"移入回收站"
      })
       
       const handleAction = ({key}:any)=>{
        if(key==="preview"){
          navigate(`/article/preview/${record.id}`)
        }
        if(key==="edit"){
          navigate(`/admin/article/edit/${record.id}`)
        }
        if(key==="publish"){
          updateArticleStatus(record.id,"published").then(()=>{
            message.success("发布成功")
            loadArticles()
          })
        }
        if(key==="offline"){
          updateArticleStatus(record.id,"offline").then(()=>{
            message.success("下架成功")
            loadArticles()
          })
        }
        if(key==="delete"){
           updateArticleStatus(record.id,"trash").then(()=>{
            message.success("已移入回收站")
            loadArticles()
           })
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
        <Select placeholder="文章状态" allowClear options={[{label:"发布",value:"published"},{label:"草稿",value:"draft"}]} onChange={value=>{setStatusFilter(value||"")
          setPage(1)
        }}></Select>
        <Button type="primary" onClick={()=>navigate("/admin/article/create")}>新增文章</Button>
        {
          selectedRowKeys.length>0&&
          <div className="batch-action">
            <span>已选择{selectedRowKeys.length}篇文章</span>
           <Dropdown menu={{
            items:batchItems,
            onClick:({key})=>{
                if(key==="publish"){
                handleBatchPublish()
              }
              if(key==="offline"){
                handleBatchOffline()
              }
              if(key==="delete"){
                handleBatchDelete()
              }
            }
           }}>
             <Button>
              批量操作 ▼
              </Button>

           </Dropdown>
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