import { Avatar,Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import './index.scss';
import { useDispatch } from "react-redux";
import { logout } from "../../store/modules/user";
import { useNavigate } from "react-router-dom";

export default function Header(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        <span className="username">admin</span>
      </div>
     </Dropdown>
    </div>
  )
}