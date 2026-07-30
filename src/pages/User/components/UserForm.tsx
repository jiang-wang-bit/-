import {Form,Input,message,Button,Select} from "antd"
import type {User} from "../../../types/user"
import { useEffect } from "react"
interface UserFormProps{
  initialValues?:Partial<User>
  onSubmit:(values:UserFormValues)=>void
}
export interface UserFormValues{
  username:string;
  email:string;
  role:User["role"];
  status:User["status"]
}
export default function UserForm({initialValues,onSubmit}:UserFormProps){
  const [form] = Form.useForm()
  useEffect(()=>{
    if(initialValues){
      form.setFieldsValue({
        username:initialValues.username,
        email:
        initialValues.email,
        role:
        initialValues.role,
        status:
        initialValues.status
      })
    }
  },[initialValues,form])

  return(
     <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item label="用户名" name="username" rules={[{required:true,message:"请输入用户名"}]}>
        <Input placeholder="请输入用户名"></Input>
      </Form.Item>

      <Form.Item label="邮箱" name="email" rules={[{required:true,message:"请输入邮箱"}]}>
        <Input placeholder="请输入邮箱"></Input>
      </Form.Item>

      <Form.Item label="角色" name="role" rules={[{required:true,message:"请选择角色"}]}>
       <Select options={[
        {
          value:"管理员",
          label:"管理员"
        },
        {
          value:"普通用户",
          label:"普通用户"
        }
       ]}/>
      </Form.Item>

      <Form.Item label="状态" name="status" rules={[{required:true,message:"请选择状态"}]}>
        <Select options={[
          {
            value:"正常",
            label:"正常"
          },
          {
            value:"禁用",
            label:"禁用"
          }
        ]}/>
      </Form.Item>

      <Button type="primary" htmlType="submit">保存</Button>
     </Form>
  )
}