import "./index.scss"
import {Table,Button,Space, message, Popconfirm,Empty} from "antd"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryList,deleteCategory } from "../../api/category";
interface CategoryType {
 id:number;
 name:string;
 createTime:string;
}
export default function Category(){
  const navigate = useNavigate()
  const [categories,setCategories] = useState<CategoryType[]>([])
  const [loading,setLoading] = useState(false)
  const loadCategory = async()=>{
   try{
      setLoading(true)
      const res = await getCategoryList()
      setCategories(res)
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
    await deleteCategory(id)
    message.success("删除成功")
    loadCategory()
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
      dataIndex:"createTime",
      key:"createTime"
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
         <Button type="primary" onClick={()=>navigate("create")}>新增分类</Button>
        </div>
        
       <Table rowKey="id" columns={columns} dataSource={categories} loading={loading} locale={{emptyText:<Empty description="暂无分类"/>}} />
   </div>
  )

}