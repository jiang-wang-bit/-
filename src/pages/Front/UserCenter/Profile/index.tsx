import {Card,Form,Input,Button,Avatar,message} from "antd"
import {UserOutlined} from "@ant-design/icons"
import { useSelector,useDispatch } from "react-redux"
import { updateUserInfo } from "../../../../store/modules/auth"
import type { RootState } from "../../../../store"
import "./index.scss"
export default function Profile() {
  const dispatch = useDispatch()
  const[form] = Form.useForm()
  // 获取用户信息
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  // 保存修改
  const submit = (values:any)=>{
    dispatch(updateUserInfo(values))
    message.success("修改成功")
  }
  return (
     <Card title="个人资料" className="profile-card">
      <div className="avatar-box">
        <Avatar size={80} src={userInfo?.avatar} icon={<UserOutlined/>}/>
      </div>

      <Form form={form} layout="vertical" initialValues={{
        username:userInfo?.username,
        role:userInfo?.role,
        email:userInfo?.email
      }} onFinish={submit}>
       
        <Form.Item label="用户名" name="username" rules={[{required:true,message:"请输入用户名"}]}>
          <Input placeholder="请输入用户名"/>
        </Form.Item>

        <Form.Item label="角色" name="role">
             <Input disabled/>
        </Form.Item>
       
        <Form.Item label="邮箱" name="email" rules={[{required:true,message:"请输入邮箱"}]}>
           <Input placeholder="请输入邮箱"/>
        </Form.Item>

          <Button type="primary" htmlType="submit">保存修改</Button>
      </Form>
     </Card>

  )
}