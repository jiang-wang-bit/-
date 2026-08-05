import { Button, Form, Input, Card, message } from 'antd';
import './index.scss';
import type { LoginParams } from '../../types/auth';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginApi } from '../../api/auth';
import { login } from "../../store/modules/auth";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submit = async (values: LoginParams) => {
 
   try{
    const res = await loginApi(values)
    dispatch(login(res))
    message.success("登录成功")
    navigate("/portal")
   }catch(err){
    message.error("登录失败")
   }
  }

  return (

    <div className="login-page">

      <Card title="博客后台管理系统" className="login-card">
        <Form onFinish={submit}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            登录
          </Button>

        </Form>
      </Card>



    </div>

  )

}