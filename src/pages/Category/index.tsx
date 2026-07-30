import "./index.scss"
import {Table,Button,Space} from "antd"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryList } from "../../api/category";
interface CategoryType {
 id:number;
 name:string;
 createTime:string;
}
export default function Category(){
  const navigate = useNavigate()
  const [categories,setCategories] = useState<CategoryType[]>([])
  const loadCategory = async()=>{
    const res =await getCategoryList()
    setCategories(res)
  }
  useEffect(()=>{
    loadCategory()
  },[])
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
        <Button type="link">编辑</Button>
        <Button type="link" danger>删除</Button>
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
        <Table columns={columns} dataSource={categories}/>
    </div>

  )

}