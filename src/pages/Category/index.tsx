import "./index.scss"
import {Table,Button,Space, message, Popconfirm,Empty,Tag,Input} from "antd"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryList,deleteCategory } from "../../api/category";
import dayjs from "dayjs";
import { current } from "@reduxjs/toolkit";
interface CategoryType {
 id:number;
 name:string;
 createTime:string;
 status:string
}
export default function Category(){
  const navigate = useNavigate()
  const [categories,setCategories] = useState<any[]>([])
  const [loading,setLoading] = useState(false)
  const [keyword,setKeyword] = useState("")
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const [total,setTotal] = useState(0)

  const loadCategory = async(params?:{
    page?:number
    pageSize?:number
    keyword?:string
  })=>{
   try{
      setLoading(true)
      const res = await getCategoryList({
        page:1,
        pageSize:10,
        ...params
      })
      setCategories(res.list)
      setTotal(res.total)
   }
   catch(err){
      console.log(err)
   }finally{
    setLoading(false)
   }
  }

  useEffect(()=>{
    loadCategory()
  },[])
  // 删除函数
  const handleDelete = async(id:number)=>{
    try{
    await deleteCategory(id)
    message.success("删除成功")
    loadCategory()
    }catch(err:any){
      message.error(err.response.data.detail)
    }

  }
  const columns = [
    {
      title:"ID",
      dataIndex:"id",
      key:"id"
    },
    {
      title:"分类名称",
      dataIndex:"name",
      key:"name"
    },
    {
      title:"创建时间",
      dataIndex:"create_time",
      key:"create_time",
      render:(time:string)=>{
       return dayjs(time).format("YYYY-MM-DD")
      }
    },
  
    {
      title:"文章数量",
      dataIndex:"article_count",
      render:(count:number)=>(
        <Tag color="blue">{count}篇</Tag>
      )
    },
    {
      title:"操作",
      key:"action",
      render:(_:any,record:CategoryType)=>(
        <Space>
        <Button type="link" onClick={()=>navigate(`/admin/category/edit/${record.id}`)}>编辑</Button>
        <Popconfirm title="确认删除这个分类吗" onConfirm={()=>handleDelete(record.id)}>
        <Button type="link" danger>删除</Button>
        </Popconfirm>
        </Space>
      )
    }
  ]
  return (
    <div className="category-page">
        <div className="category-header">
         <h2>分类管理</h2>

         <Space>
         <Input placeholder="请输入分类名称" value={keyword} onChange={(e)=>setKeyword(e.target.value)}/>
         <Button type="primary" onClick={()=>{loadCategory({keyword})}}>搜索</Button>
         <Button type="primary" onClick={()=>{setKeyword("")
          loadCategory()}}>重置</Button>
          </Space>

          <Space>
         <Button type="primary" onClick={()=>navigate("create")}>新增分类</Button>
         <Button type="primary" onClick={()=>navigate("trash")}>回收站</Button>
         </Space>
        </div>
        
       <Table rowKey="id" columns={columns} dataSource={categories} loading={loading} locale={{emptyText:<Empty description="暂无分类"/>}} pagination={{current:page,pageSize,total,onChange:(current,size)=>{
        setPage(current)
        setPageSize(size)
        loadCategory({
          page:current,
          pageSize:size
        })
       }}}/>
   </div>
  )

}