import {Layout,Card} from "antd"
import {Outlet} from "react-router-dom"
import UserMenu from "./Components/UserMenu"
import "./index.scss"
const {Content,Sider} = Layout
export default function UserCenter() {
  return (
    <div className="user-center">
   <Card title="用户中心">
   <Layout>
    <Sider className="user-sider" theme="light">
      <UserMenu/>
    </Sider>

    <Content className="user-content">
      <Outlet/>
    </Content>
   </Layout>
   </Card>
   </div>
  )
}