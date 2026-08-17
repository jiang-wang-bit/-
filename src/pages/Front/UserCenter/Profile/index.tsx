import {Card,Form,Input,Button,Avatar,message,Upload} from "antd"
import {UserOutlined,UploadOutlined} from "@ant-design/icons"
import { useSelector,useDispatch } from "react-redux"
import { useEffect,useState } from "react"
import { updateUserInfo} from "../../../../store/modules/auth"
import { getProfile,updateProfile} from "../../../../api/profile"
import type { RootState } from "../../../../store"
import ImgCrop from "antd-img-crop"
import { updatePassword } from "../../../../api/profile"
import imageCompression from "browser-image-compression"
import "./index.scss"
export default function Profile() {
  const dispatch = useDispatch()
  const[form] = Form.useForm()
  // 获取用户信息
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  const [avatar,setAvatar] = useState(userInfo?.avatar)
  useEffect(()=>{

 if(userInfo?.avatar){
   setAvatar(userInfo.avatar)
 }
},[userInfo?.avatar])

  useEffect(()=>{
    if(!userInfo?.id){
     return
    }

    getProfile().then(res=>{

 console.log("profile返回:",res)
      form.setFieldsValue({
        username:res.username,
        role:res.role,
        email:res.email
      })
     setAvatar(res.avatar)
    })
  },[userInfo?.id])
  // 保存修改
  const submit = async(values:any)=>{
  if(!userInfo?.id){
    return
  }
  const res = await updateProfile(
    {
    username:values.username,
    email:values.email,
    avatar:avatar
  })
    dispatch(updateUserInfo({
      ...res,
      avatar
  }))
    message.success("修改成功")
  }

  // 修改密码
  const submitPassword = async(values:any)=>{
    try{
    await updatePassword(values)
    message.success("修改成功")
    }catch(err){
     message.error("修改失败")
    // console.log(err)
    }
  
  }
  return (
     <Card title="个人资料" className="profile-card">
      <div className="avatar-box">
        <ImgCrop rotationSlider showGrid aspect={1}>
        <Upload showUploadList={false} beforeUpload={async(file)=>{
          // 文件类型限制
          const isImage = file.type==="image/jpeg"||file.type==="image/png"||file.type==="image/webp"
          if(!isImage){
            message.error("只能上传JPG,PNG,WEBP格式图片")
            return Upload.LIST_IGNORE
          }
          // 文件大小限制
          const isLt2M = file.size/1024/1024<2
          if(!isLt2M){
            message.error("头像大小不能超过2MB")
            return Upload.LIST_IGNORE
          }
          // 压缩
          const options = {
            maxSizeMB:0.2,
            maxWidthOrHeight:300
          }
          const compressedFile =
          await imageCompression(
          file,
          options
          )
          const reader = new FileReader()
          reader.onload=async()=>{
          const avatarBase64 = reader.result as string
          setAvatar(avatarBase64)
          if(!userInfo?.id){
            return
          }
          await updateProfile(
          {
            username:userInfo.username,
            email:userInfo.email,
            avatar:avatarBase64
          }
          )

          // 全局用户信息更新
          dispatch(updateUserInfo({avatar:avatarBase64}))
          message.success("头像更新成功")
          }
          reader.readAsDataURL(compressedFile)
          return false
        }}>
           <Avatar size={80} src={avatar} icon={<UserOutlined/>} style={{cursor:"pointer"}}/>
        </Upload>
        </ImgCrop>
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

      <Form onFinish={submitPassword} className="password">
        <Form.Item name="old_password">
         <Input placeholder="旧密码"/>
        </Form.Item>

        <Form.Item name="new_password">
         <Input placeholder="新密码"/>
        </Form.Item>

        <Button type="primary" htmlType="submit">修改密码</Button>
      </Form>
     </Card>

  )
}