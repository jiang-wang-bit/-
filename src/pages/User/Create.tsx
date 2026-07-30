import {Card,message} from "antd"
import { useNavigate } from "react-router-dom"
import UserForm from "./components/UserForm"
import { createUser } from "../../api/user"
import "./index.scss"
export default function CreateUser(){
  const navigate = useNavigate()
  const handleSubmit = async(values:any)=>{
     try{
        await createUser(values)
        message.success("新增成功")
        navigate("/admin/user")
     }catch(err){
        message.error("新增失败")
     }
  }
  return(
    <div className="create-page">
      <Card title="新建用户">
       <UserForm onSubmit={handleSubmit}/>
      </Card>
    </div>
  )
}