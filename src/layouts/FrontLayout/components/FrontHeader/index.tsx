import { Menu,Avatar,Dropdown} from "antd"
import { useNavigate } from "react-router-dom"
import { UserOutlined } from "@ant-design/icons"
import { useDispatch,useSelector } from "react-redux"
import type { RootState } from "../../../../store"
import { logout } from "../../../../store/modules/auth"
import "./index.scss"
export default function FrontHeader(){
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // 获取用户信息
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  const items = [
    {
      key:"/",
      label:"首页"
    },
    {
      key:"/article",
      label:"文章"
    },
    {
      key:"/category",
      label:"分类"
    },
    {
      key:"/user/favorite",
      label:"我的收藏"
    },
  ]
  // 用户菜单
  const userMenu = [
    {
      key:"profile",
      label:"个人中心"
    },
    {
      key:"logout",
      label:"退出登录"
    },
     ...(userInfo?.role==="admin"?[
    {
      key:"dashboard",
      label:"返回后台"
    }]:[])
  ]

  const handleUserClick = ({key}:any)=>{
    if(key==="profile"){
      navigate("/user")
    }
    if(key==="dashboard"){
      navigate("/admin/dashboard")
    }
    if(key==="logout"){
      dispatch(logout())
      navigate("/login")
    }
  }
  return(
    <header className="front-header">
      <div className="logo">my logo</div>
      <Menu items={items} mode="horizontal" onClick={({key})=>navigate(key)}/>
      <div className="header-user">
        <Dropdown menu={{items:userMenu,onClick:handleUserClick}}>
           <div className="user-info">
            <Avatar size={35} src={userInfo?.avatar} icon={<UserOutlined/>}/>
            <span>{userInfo?.username||"游客"}</span>
           </div>
        </Dropdown>
      </div>
    </header>
  )
}