import {Input,Form,Button,Space} from "antd"
import { useNavigate } from "react-router-dom"
interface Props{
  initialValue?:{
    name:string
  }
  onSubmit:(values:{
    name:string
  })=>void
}
export default function CategoryForm({initialValue,onSubmit}:Props){
  const [form] = Form.useForm()
  const navigate = useNavigate()
  return(
    <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={initialValue}>
     <Form.Item label="分类名称" name="name" rules={[{required:true,message:"请输入分类名称"}]}>
       <Input placeholder="请输入分类名称" />
     </Form.Item>
     <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit">保存</Button>
        <Button danger onClick={()=>navigate("/admin/category")}>取消</Button>
      </Space>
     </Form.Item>
    </Form>
  )
}