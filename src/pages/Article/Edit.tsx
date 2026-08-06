import {Form,Input,Button,Select,Card,message,Upload} from "antd"
import { useNavigate ,useParams} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { updateArticle } from "../../store/modules/article"
import { useEffect,useState } from "react"
import "./index.scss"
import {getCategoryList} from "../../api/category"
import MDEditor from "@uiw/react-md-editor"
import type { CategoryType } from "../../types/category"
import MarkDownEditor from "../../components/MarkDownEditor"
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
  const [content,setContent] = useState("")
  const [cover,setCover] = useState("")
    // 回填表单
  useEffect(()=>{
  if(article){
    form.setFieldsValue({
      title:article.title,
      categoryId:article.categoryId,
      status:article.status
    })
    setContent(article.content)
    setCover(article.cover||"")
  }
},[article,form])
    //  提交表单
    const submit = (values:any)=>{
    dispatch(updateArticle({
      ...article,
      ...values,
      content,
      cover
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

         <Form.Item label="文章封面">
          {
            cover&&(<img src={cover} style={{width:240,height:150,objectFit:"cover", borderRadius:8}}/>)}
          <Upload showUploadList={false} beforeUpload={(file)=>{
            const reader = new FileReader()
            reader.onload=()=>{
              setCover(reader.result as string)
            }
            reader.readAsDataURL(file)
            return false
          }} className="upload">
            <Button>更换封面</Button>
          </Upload>
         </Form.Item>

         <Form.Item label="文章分类" name="categoryId" rules={[{required:true,message:"请选择分类"}]}>
           <Select options={categories.map(item=>({value:item.id,label:item.name}))} />
         </Form.Item>

         <Form.Item label="文章内容" rules={[{required:true,message:"请输入内容"}]}>
          <MarkDownEditor value={content} onChange={setContent}/>
         </Form.Item>

         <Form.Item label="状态" name="status" initialValue="published">
          <Select options={[
            {value:"published",label:"发布"},
            {value:"draft",label:"草稿"}
          ]}/>
         </Form.Item>
         <Button type="primary" htmlType="submit" className="save-btn">保存修改</Button>
       </Form>
    </Card>
    </div>
  )
}