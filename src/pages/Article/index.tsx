import {Table,Button,Tag,Space,Popconfirm,Input,Select,Dropdown, message} from "antd"
import './index.scss'
import { useNavigate } from "react-router-dom"
import { useState,useEffect,useMemo} from "react"
import { getCategoryList } from "../../api/category"
import { getArticleList,updateArticleStatus} from "../../api/article"
import type { CategoryType } from "../../types/category"
import type { ArticleType } from "../../types/article"
import type { MenuProps } from "antd"
import useTableQuery from "../../hooks/useTableQuery"
import dayjs from "dayjs"
export default function Article(){
  const navigate = useNavigate()
  const [statusFilter,setStatusFilter] = useState<string|undefined>()
  const [category,setCategory] = useState<number|undefined>()
  const {

      page,

      pageSize,

      keyword,

      searchKeyword,

      loading,


      setKeyword,

      setLoading,

      total,

      setTotal,


      handleSearch:baseSearch,

      handleReset:baseReset,

      handlePageChange


}=useTableQuery()
  const [searchCategory,setSearchCategory]=useState<number>()
  const [searchStatus,setSearchStatus]=useState<string>()
  // 批量删除
  const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])
  // 批量删除函数
  const handleBatchDelete =async ()=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择文章")
      return
    }
    await Promise.all(
    selectedRowKeys.map(id=>
      updateArticleStatus(id,"trash")
    )
    )
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
 
//  加载文章
  const loadArticles = async()=>{

   try{

   setLoading(true)


   const res = await getArticleList({
    page,
    pageSize,
    keyword:searchKeyword,
    status:searchStatus,
    category_id:searchCategory
   })


   console.log("后台文章列表",res)


   setData(res.list ?? [])
   setTotal(res.total)
   

 }catch(err){

   console.log("获取文章失败",err)

   setData([])


 }finally{

   setLoading(false)

 }
}

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

      getCategoryList()
      .then(res=>{
        setCategories(res.list)
      })

      },[])

      useEffect(()=>{

      loadArticles()

      },[
      page,
      pageSize,
      searchKeyword,
      searchStatus,
      searchCategory
      ])
 
    // 重置函数
    const handleArticleReset=()=>{
      baseReset()
      setSearchCategory(undefined)
      setSearchStatus(undefined)
      setCategory(undefined)
      setStatusFilter(undefined)
    }

    // 查询函数
    const handleArticleSearch=()=>{
      baseSearch()
      // 文章自己筛选
      setSearchStatus(statusFilter)
      setSearchCategory(category)
    }
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

        {/* 搜索 */}
        <Input placeholder="搜索文章标题" value={keyword} onChange={e=>{setKeyword(e.target.value) }} style={{width:"400px"}}></Input>
        <Select placeholder="选择分类" allowClear value={category||undefined} options={categories.map(item=>({label:item.name,value:item.id}))} onChange={value=>{setCategory(value)
        }}></Select>
        <Select placeholder="文章状态" allowClear value={statusFilter||undefined} options={[{label:"发布",value:"published"},{label:"草稿",value:"draft"},{label:"已下架",value:"offline"}]} onChange={value=>{setStatusFilter(value||"")
        }}></Select>

        {/* 查询按钮 */}
        <Button type="primary" onClick={handleArticleSearch}>查询</Button>
        {/* 重置按钮 */}
        <Button onClick={handleArticleReset}>重置</Button>

        {/* 回收站 */}
        <Button type="primary" onClick={()=>navigate("/admin/article/trash")}>回收站</Button>
        
        <Button type="primary" onClick={()=>navigate("/admin/article/create")}>新增文章</Button>
        {
  
          <div className="batch-action">
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
             <Button disabled={selectedRowKeys.length===0}>
              批量操作 ▼
              </Button>

           </Dropdown>
          </div>
        }
      </div>
    <Table columns={columns} 

    loading={loading}
    
    dataSource={data} 
    
    rowKey="id" 
    
    pagination={{current:page,
      pageSize:pageSize,
      total:total,
      showSizeChanger:true,
      showTotal:(total)=>{
        return`共${total}篇文章`
      },
      onChange:handlePageChange
    }}
      
      rowSelection={{selectedRowKeys,
        onChange:(keys)=>{
         setSelectedRowKeys(
     keys.map(key=>Number(key))
   )
      }}}/>
     </div>

  )

}