import {Card,Avatar,Button} from "antd"
import { useNavigate } from "react-router-dom"
import { useSelector, UseSelector } from "react-redux"
import type { RootState } from "../../store"
import { UserOutlined } from "@ant-design/icons"
import "./index.scss"
export default function Portal(){
  const navigate = useNavigate()
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  return(
   <div className="portal">
    <Card className="portal-card">
      <Avatar size={90} src={userInfo?.avatar} icon={<UserOutlined/>}/>
      <h1>欢迎回来:{userInfo?.username}</h1>
      <p>
      请选择你要进入的区域
      </p>
      <div className="portal-buttons">



        <Button

        type="primary"

        size="large"

        onClick={()=>{

        navigate("/")

        }}

        >

        进入博客

        </Button>

        {

        userInfo?.role==="admin"

        &&
        <Button

        size="large"

        onClick={()=>{

        navigate("/admin/dashboard")

        }}

        >

        进入管理后台

        </Button>


        }



        </div>



        </Card>

    </div>
  )
}