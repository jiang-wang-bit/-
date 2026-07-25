import {Button,Form,Input,Card,message} from 'antd';
import './index.scss';
import{useNavigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import {login} from "../../store/modules/user";
export default function Login() {
   const navigate = useNavigate();
   const dispatch = useDispatch();
  const submit = (values: any) => {
    console.log('Success:', values);
    if(values.username === 'admin' && values.password === '123456'){
      message.success('登录成功');
      const token = "blog-token-123";
      const userInfo = {
        username:"admin",
        role:"管理员",
        avatar:""
      }
      //  保存token到redux中
      dispatch(login({token,userInfo}));
    // 跳转后台
      navigate("/admin/dashboard");

      window.location.href = '/admin/dashboard';
    }
    else{
      message.error('用户名或密码错误');
    }
  }

    return(

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