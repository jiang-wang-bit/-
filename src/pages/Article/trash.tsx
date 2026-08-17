import { Table,Button,Popconfirm,Tag,message,Space,Dropdown} from "antd"
import { useState,useEffect } from "react"
import { restoreArticle,forceDeleteArticleApi,batchDeleteArticle,batchRestoreArticle } from "../../api/article"
import { getTrashArticle } from "../../api/article"
import type { ArticleType } from "../../types/article"
import "./index.scss"
export default function Trash(){
  const [articles,setArticles] = useState<ArticleType[]>([])
  const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])
   const selectedArticles = articles.filter(item=>selectedRowKeys.includes(item.id))
   const loadArticles = async()=>{
     const res = await getTrashArticle()
     console.log("回收站文章:",res)
     setArticles(res)
   }
   useEffect(()=>{
           loadArticles() 
       },[])

  const restore = async(article:ArticleType)=>{
    try{
      await restoreArticle(article.id)
       message.success("恢复成功")
       loadArticles()
    }catch(err){
      message.error("恢复失败")
    }
   
  }
  // 批量恢复：
  const handleBatchRestore=async()=>{
     if(selectedArticles.length===0){
      message.warning("请选择文章")
      return
     }
     try{
    await batchRestoreArticle(selectedRowKeys)
    message.success(
      `恢复${selectedRowKeys.length}篇文章`
    )
    setSelectedRowKeys([])
    loadArticles()
  }catch(err){
    message.error("批量恢复失败")
  }
  }

  // 单个彻底删除
  const handleForceDelete = async(id:number)=>{
    try{
      await forceDeleteArticleApi(id)
      message.success("彻底删除成功")
      await loadArticles()
    }catch(err){
      message.error("删除失败")
    }
  }


  // 批量删除
  const handleBatchForceDelete=async()=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择文章")
      return
    }
    try{
      await batchDeleteArticle(selectedRowKeys)
      message.success(
         `永久删除${selectedRowKeys.length}篇文章`
      )
      setSelectedRowKeys([])
      loadArticles()
    }catch(err){

    console.log(err)

    message.error("永久删除失败")

  }
  }

  const columns = [
    {
       title:"ID",
      dataIndex:"id"
    },
    {
      title:"标题",
      dataIndex:"title"
    },
    {
      title:"作者",
      dataIndex:"author"
    },
    {
      title:"状态",
      render:()=>(
        <Tag color="red">回收站</Tag>
      )
    },
    {
      title:"操作",
      render:(record:ArticleType)=>(
        <>
        <Space>
        <Button size="small" onClick={()=>restore(record)}>恢复</Button>
        <Popconfirm title="确定永久删除吗?" onConfirm={()=>handleForceDelete(record.id)}>
            <Button danger size="small">永久删除</Button>
        </Popconfirm>
        </Space>
        </>
      )
    }
  ]
  const batchItems = [
    {
      key:"delete",
      label:"批量删除"
    },
    {
      key:"restore",
      label:"批量恢复"
    }
  ]
  return(
    <div className="trash-page">
      <div className="trash-page-title">
           <h2>回收站</h2>
        { selectedRowKeys.length>0&&(
          <>
          <div className="action">
      <span>已选择{selectedRowKeys.length}篇文章</span>
      <Dropdown menu={{items:batchItems,
      onClick:({key})=>{
        if(key==="delete"){
          handleBatchForceDelete()
        }
        if(key==="restore"){
          handleBatchRestore()
        }
      }}}>
        <Button>批量操作</Button>
      </Dropdown>
      </div>
      </>
      )
       }
      </div>
      <Table dataSource={articles} columns={columns} rowKey="id" rowSelection={{selectedRowKeys,
        onChange:(keys)=>{
          setSelectedRowKeys(
            keys.map(key=>Number(key))
          )
        }
      }}/>
    </div>
  )
}