import {Layout} from "antd";
import './index.scss';
import {Outlet} from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Siderbar";
const {Content} = Layout;
export default function AdminLayout(){
  return (
    <Layout className="admin-layout">
    <Header />
   
    <Layout>
         <Sidebar />

      < Content className="admin-content">
        <Outlet/>
      </Content>
    </Layout>

      </Layout>
  )
}