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
  status:User["status"];
  password:string
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

          {/* <Form.Item
      label="密码"
      name="password"
      rules={[
        {
          required:true,
          message:"请输入密码"
        }
      ]}
    >
      <Input.Password placeholder="请输入密码"/>
      </Form.Item> */}

      <Form.Item label="角色" name="role" rules={[{required:true,message:"请选择角色"}]}>
       <Select options={[
        {
          value:"admin",
          label:"admin"
        },
        {
          value:"user",
          label:"user"
        }
       ]}/>
      </Form.Item>

      <Form.Item label="状态" name="status" rules={[{required:true,message:"请选择状态"}]}>
        <Select options={[
          {
            value:"active",
            label:"正常"
          },
          {
            value:"disabled",
            label:"禁用"
          }
        ]}/>
      </Form.Item>

      <Button type="primary" htmlType="submit">保存</Button>
     </Form>
  )
}