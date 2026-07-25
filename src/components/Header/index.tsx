import { Avatar,Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import './index.scss';
import { useDispatch } from "react-redux";
import { logout } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";

export default function Header(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const items = [
    {
      key:'logout',
      label:'退出登录'
    }
  ];
  const handleClick = ({key}:any)=>{
    if(key==='logout'){
      dispatch(logout());
      navigate('/login');
      console.log("logout")
    }
  }
  return (
    <div className="header">

     <div className="header-title">
       博客管理后台
     </div>

     <Dropdown menu={{items,onClick:handleClick}} placement="bottomRight">
      
      <div className="user-info">
        <Avatar icon={<UserOutlined />} />
        <div className="username">{userInfo?.username || '用户'}</div>
        <div className="role">{userInfo?.role}</div>
        </div>
     </Dropdown>
    </div>
  )
}