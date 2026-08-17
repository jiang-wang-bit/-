import {Card,message} from "antd"
import { useEffect,useState } from "react"
import UserForm from "./components/UserForm"
import { UserFormValues } from "./components/UserForm"
import { useNavigate,useParams } from "react-router-dom"
import { updateUser,getUserDetail } from "../../api/user1"
import type {User} from "../../types/user"
export default function EditUser(){
  const navigate = useNavigate()
  const {id} = useParams()
  const userId = Number(id)
  const [user,setUser] = useState<User>()
  // 获取用户详情
  const loadUser = async()=>{
     if(!userId) return
     const res = await getUserDetail(userId)
     setUser(res)
  }
  useEffect(()=>{
    loadUser()
  },[userId])

  // 提交修改
  const handleSubmit = async(values:UserFormValues)=>{
     try{
       await updateUser(userId,values)
       message.success("修改成功")
       navigate("/admin/user")
     }catch(err){
      message.error("修改失败")
     }
  }
  return(
    <div className="edit-page">
      <Card title="编辑用户">
       {user&&<UserForm onSubmit={handleSubmit} initialValues={user}/>}
      </Card>
    </div>
  )
}