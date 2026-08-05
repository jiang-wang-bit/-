import {Form,Input,Button,Select,Card,message,Upload} from "antd"
import { useNavigate } from "react-router-dom"
import "./create.scss"
import { useDispatch, useSelector } from "react-redux"
import {useState,useEffect} from "react"
import MDEditor from "@uiw/react-md-editor"
import type { RootState } from "../../store"
import {getCategoryList} from "../../api/category"
import type { CategoryType } from "../../types/category"
import { addArticle } from "../../store/modules/article"
import MarkDownEditor from "../../components/MarkDownEditor"
export default function Create(){
  const dispatch = useDispatch()
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  const [form] = Form.useForm()
  const [categories,setCatgories] = useState<CategoryType[]>([])
  const [content,setContent] = useState("")
  const [cover,setCover] = useState("")
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
      content:content,
      cover,
      categoryId:values.categoryId,
      status:values.status,
      author:userInfo?.username,
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

         <Form.Item label="文章封面">
          <Upload showUploadList={false} beforeUpload={(file)=>{
            const reader = new FileReader()
            reader.onload=()=>{
              setCover(reader.result as string)
            }
            reader.readAsDataURL(file)
            return false
          }}>
            {
              cover?<img src={cover} style={{width:240,height:140,objectFit:"cover"}}/>:<Button>上传封面</Button>
            }
          </Upload>
         </Form.Item>

         <Form.Item label="文章分类" name="categoryId" rules={[{required:true,message:"请选择分类"}]}>
           <Select options={categories.map(item=>({value:item.id,label:item.name}))} />
         </Form.Item>

         <Form.Item label="文章内容" name="content" rules={[{required:true,message:"请输入内容"}]}>
        <MarkDownEditor value={content} onChange={setContent}/>
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