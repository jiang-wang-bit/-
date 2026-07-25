import {Layout} from "antd";
import './index.scss';
import {Outlet} from "react-router-dom";
import Sidebar from "../../components/Siderbar";
const {Header,Content} = Layout;
export default function AdminLayout(){
  return (
    <Layout className="admin-layout">
     <Header className="admin-header">
        博客后台
      </Header>
   
    <Layout>
         <Sidebar />

      < Content className="admin-content">
        <Outlet/>
      </Content>
    </Layout>

      </Layout>
  )
}