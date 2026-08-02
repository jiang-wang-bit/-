import {Form,Input,Button,Select,Card,message} from "antd"
import { useNavigate } from "react-router-dom"
import "./create.scss"
import { useDispatch } from "react-redux"
import {useState,useEffect} from "react"
import {getCategoryList} from "../../api/category"
import type { CategoryType } from "../../types/category"
import { addArticle } from "../../store/modules/article"
import Category from "../Category"
export default function Create(){
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [categories,setCatgories] = useState<CategoryType[]>([])
  useEffect(()=>{
     getCategoryList().then(res=>
     {
      setCatgories(res)
     }
     )
  },[])
  const navigate = useNavigate()
  const submit = (values:any)=>{
    const article = {
      id:Date.now(),
      title:values.title,
      content:values.content,
      categoryId:values.categoryId,
      status:values.status,
      author:"admin",
      createTime:new Date().toISOString()
    }
    dispatch(addArticle(article))
    message.success("文章创建成功")
    navigate("/admin/article")
  }
  return (
    <div className="article-create">
    <Card title="新增文章" className="create-card">
       <Form form={form} layout="vertical" onFinish={submit}>
         <Form.Item label="文章标题" name="title" rules={[{required:true,message:"请输入文章标题"}]}>
          <Input placeholder="请输入标题" />
         </Form.Item>

         <Form.Item label="文章分类" name="categoryId" rules={[{required:true,message:"请选择分类"}]}>
           <Select options={categories.map(item=>({value:item.id,label:item.name}))} />
         </Form.Item>

         <Form.Item label="文章内容" name="content" rules={[{required:true,message:"请输入内容"}]}>
          <Input.TextArea placeholder="请输入文章内容" rows={8}/>
         </Form.Item>

         <Form.Item label="状态" name="status" initialValue="发布">
          <Select options={[
            {value:"发布",label:"发布"},
            {value:"草稿",label:"草稿"}
          ]}/>
         </Form.Item>
         <Button type="primary" htmlType="submit" className="save-btn">保存文章</Button>
       </Form>
    </Card>
    </div>
  )
}