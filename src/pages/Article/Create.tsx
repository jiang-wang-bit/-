import {Form,Input,Button,Select,Card,message} from "antd"
import { useNavigate } from "react-router-dom"
export default function Create(){
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const submit = (values:any)=>{
    console.log(values)
    message.success("文章创建成功")
    navigate("/admin/article")
  }
  return (
    <Card title="新增文章" className="create-card">
       <Form form={form} layout="vertical" onFinish={submit}>
         <Form.Item label="文章标题" name="title" rules={[{required:true,message:"请输入文章标题"}]}>
          <Input placeholder="请输入标题" />
         </Form.Item>

         <Form.Item label="文章分类" name="category" rules={[{required:true,message:"请选择分类"}]}>
           <Select options={[
              {value:'vue',label:'vue'},
              {value:'React',label:'React'},
              {value:'python',label:'python'}
           ]} />
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
         <Button type="primary" htmlType="submit">保存文章</Button>
       </Form>
    </Card>
  )
}