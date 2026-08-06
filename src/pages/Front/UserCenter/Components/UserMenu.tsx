import {Menu,Layout} from 'antd';
import './index.scss';
import {useNavigate,useLocation} from "react-router-dom";
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  MessageOutlined
} from "@ant-design/icons"
export default function UserMenu(){
  const navigate = useNavigate();
  const location = useLocation();
  const {Sider} = Layout;
  const items = [
    {
      key:"profile",
      icon:<UserOutlined />,
      label:"个人资料"
    },
    {
      key:"favorite",
      icon:<HeartOutlined />,
      label:"我的收藏"
    },
    {
      key:"comments",
      icon:<MessageOutlined />,
      label:"我的评论"
    }
  ]

const key = location.pathname.split("/")[2] || "profile"
  return(
    <Sider className="user-menu">
      <Menu items={items} theme="light" mode="inline" selectedKeys={[key]} onClick={({key})=>navigate(`/user/${key}`)} />
      </Sider>
  )
}