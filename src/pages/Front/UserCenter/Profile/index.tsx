import {Card,Form,Input,Button,Avatar,message,Upload} from "antd"
import {UserOutlined,UploadOutlined} from "@ant-design/icons"
import { useSelector,useDispatch } from "react-redux"
import { updateUserInfo} from "../../../../store/modules/auth"
import type { RootState } from "../../../../store"
import ImgCrop from "antd-img-crop"
import imageCompression from "browser-image-compression"
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
          reader.onload=()=>{
           const avatarBase64 = reader.result as string
            dispatch(updateUserInfo({avatar:avatarBase64}))
          message.success("头像更新成功")
          }
          reader.readAsDataURL(compressedFile)
          return false
        }}>
           <Avatar size={80} src={userInfo?.avatar} icon={<UserOutlined/>} style={{cursor:"pointer"}}/>
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
     </Card>

  )
}