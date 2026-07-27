import {Menu,Layout} from 'antd';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
   MessageOutlined
} from "@ant-design/icons";
const {Sider} = Layout;
const items = [
  {
    key:"/admin/dashboard",
    icon:<DashboardOutlined />,
    label:"首页"
  },
  {
    key:"/admin/article",
    icon:<FileTextOutlined />,  
    label:"文章管理"
  },
  {
    key:"/admin/category",
    icon:<AppstoreOutlined />,
    label:"分类管理"
  },
  {
    key:"/admin/user",
    icon:<UserOutlined />,
    label:"用户管理"
  },
  {
    key:"/admin/comment",
    icon:<MessageOutlined/>,
    label:"评论管理"
  }
]
export default function Sidebar(){
  const navigate = useNavigate();
  return (
    <Sider className="siderBar">
      <div className="logo">
        Blog Admin
      </div>
     <Menu items={items} theme="light" mode="inline" onClick={(e)=>navigate(e.key)}>
     </Menu>
    </Sider>
  )
}