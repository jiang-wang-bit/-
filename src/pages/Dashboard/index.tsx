import {Table,Card,Statistic,Row,Col} from 'antd';
import './index.scss';
import LineChart from '../../components/Charts/LineChart';
import {
 FileTextOutlined,
 UserOutlined,
 AppstoreOutlined
} from "@ant-design/icons";

export default function Dashboard(){

  const columns = [
    {
      title:"标题",
      dataIndex:"title",
    },
    {
      title:"作者",
      dataIndex:"author",
    },
    {
      title:"发布时间",
      dataIndex:"time",
    }
  ]

  const data = [
    {
      key:1,
      title:"React后台管理系统",
      author:"admin",
      time:"2026-07-25"
    },
    {
      key:2,
      title:"FastAPI学习笔记",
      author:"admin",
      time:"2026-07-24"
}
  ]

  return (
    <div className="dashboard">
       <h2>欢迎回来,管理员</h2>
      <Row gutter={16}> 
       {/* 文章 */}
       <Col span={8}>
       <Card>
        <Statistic title="文章数量" value={128} prefix={<FileTextOutlined/>} />
       </Card>
       </Col>
       
       {/* 用户 */}
       <Col span={8}>
       <Card>
        <Statistic title="用户数量" value={67} prefix={<UserOutlined/>} />

       </Card>
       </Col>

        {/* 分类 */}
       <Col span={8}>
       <Card>
        <Statistic title="分类数量" value={25} prefix={<AppstoreOutlined/>} />
       </Card>
       </Col>
      </Row>

       <Card title="最近发布的文章" className='article-card'>
       <Table columns={columns} dataSource={data} pagination={false}>
       </Table>
       </Card>

       <Card title="数据趋势" className='chart-card'>
         <LineChart />
       </Card>
    </div>
  )

}