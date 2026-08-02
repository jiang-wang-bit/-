import {Form,Input,Button,Select,Card,message} from "antd"
import { useNavigate ,useParams, useSearchParams} from "react-router-dom"
import { UseSelector,useDispatch, useSelector } from "react-redux"
import { updateArticle } from "../../store/modules/article"
import { useEffect,useState } from "react"
import {getCategoryList} from "../../api/category"
import type { CategoryType } from "../../types/category"
export default function Edit(){
  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [categories,setCatgories] = useState<CategoryType[]>([])
  useEffect(()=>{
     getCategoryList().then(res=> {
      setCatgories(res)
     })
  },[])
  // 获取文章数据
  const article = useSelector(
    (state:any)=>state.article.list.find((item:any)=>String(item.id)===String(id))
  )
    // 回填表单
  useEffect(()=>{
  if(article){
    form.setFieldsValue({
      title:article.title,
      categoryId:article.categoryId,
      content:article.content,
      status:article.status
    })
  }
},[article])
    //  提交表单
    const submit = (values:any)=>{
    dispatch(updateArticle({
      ...article,
      ...values
  }))
    message.success("修改成功")
    navigate("/admin/article")
  }

  return (
      <div className="article-create">
    <Card title="编辑文章" className="edit-card">
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
         <Button type="primary" htmlType="submit" className="save-btn">保存修改</Button>
       </Form>
    </Card>
    </div>
  )
}