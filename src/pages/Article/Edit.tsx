import {Form,Input,Button,Select,Card,message,Upload} from "antd"
import { useNavigate ,useParams} from "react-router-dom"
import { getArticleDetail, updateArticleApi } from "../../api/article"
import { useEffect,useState } from "react"
import "./index.scss"
import {getCategoryList} from "../../api/category"
import MDEditor from "@uiw/react-md-editor"
import type { CategoryType } from "../../types/category"
import MarkDownEditor from "../../components/MarkDownEditor"
import { ArticleType } from "../../types/article"
export default function Edit(){
  const {id} = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [categories,setCatgories] = useState<CategoryType[]>([])
  useEffect(()=>{
     getCategoryList().then(res=> {
      setCatgories(res.list)
     })
  },[])
  // 获取文章数据
  const [article,setArticle] =  useState<ArticleType | null>(null)
  const [content,setContent] = useState("")
  const [cover,setCover] = useState("")

    // 回填表单
  useEffect(()=>{
   getArticleDetail(Number(id)).then((res)=>{
    setArticle(res)
    form.setFieldsValue({
      titel:res.title,
      categoryId:res.categoryId,
      status:res.status
    })
    setContent(res.content)
    setCover(res.cover)
   })
},[id])

    //  提交表单
    const submit = async(values:any)=>{
    const article = {
      title:values.title,
      content,
      cover,
      status:values.status,
      category_id:values.categoryId,
      updateTime:new Date().toISOString()
    }
    try{
      await updateArticleApi(Number(id),article)
      message.success("修改成功")
     navigate("/admin/article")
    }catch(error){
      message.error("修改失败")
    }
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

         <Form.Item label="状态" name="status">
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