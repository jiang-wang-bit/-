import { Button, Form, Input, Card, message } from 'antd';
import "./index.scss"
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../api/auth';

export default function Register(){
  const navigate = useNavigate()
  const submit = async(values:any)=>{
    try{

    await registerApi(values)

    message.success("注册成功")

    navigate("/login")

    }catch(err:any){
      message.error("注册失败")
    }
  }

  return(
    
    <div className="register-page">

      <Card title="博客系统注册" className="register-card">
        <Form onFinish={submit}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item name="email" label="邮箱" rules={[{required:true,message:"请输入邮箱"},{type:'email',message:"邮箱格式错误"}]}>
            <Input placeholder="请输入邮箱"/>
          </Form.Item>

          <Form.Item name="password"label="密码" rules={[{ required: true, message: '请输入密码' },{min:6,message:"密码至少6位"}]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item label="确认密码" name="confirmPassword" dependencies={["password"]} rules={[{required:true,message:"请确认密码"},
            ({getFieldValue})=>({
              validator(_,value){
                if(!value||getFieldValue("password")===value){
                  return Promise.resolve()
                }
                return Promise.reject(new Error("两次密码不一致"))
              }
            })
          ]}>
           <Input placeholder='再次输入密码'/>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            注册
          </Button>

           <Button
            type="link" block onClick={()=>navigate("/login")}>
            已有账号？去登录
          </Button>



        </Form>
      </Card>



    </div>
  )
}