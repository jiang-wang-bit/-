import {Table,Card,Statistic,Row,Col} from 'antd';
import './index.scss';
import LineChart from '../../components/Charts/LineChart';
import {
 FileTextOutlined,
 UserOutlined,
 AppstoreOutlined,
 CheckCircleOutlined,
 EditOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { getCategoryList } from '../../api/category';
import { useState,useEffect } from 'react';
import type { CategoryType } from '../../types/category';
import PieChart from '../../components/Charts/pieCharts';
import type { ArticleType } from '../../types/article';
import { getDashborad } from '../../api/dashborad';
interface PublishTrend {
  date:string
  count:number
}


interface CategoryTrend {
  name:string
  value:number
}


interface RecentArticle {

  id:number

  title:string

  author:string

  createTime:string

}
export default function Dashboard(){


  //  获取分类
  const [categories,setCategories] = useState<CategoryType[]>([])

  // 统计数量
  const [dashboardData,setDashboardData] = useState<{

  userCount:number

  articleCount:number

  categoryCount:number

  publishArticleCount:number

  draftArticleCount:number


  publishTrend:PublishTrend[]

  recentArticles:RecentArticle[]

  categoryTrend:CategoryTrend[]

  }>({

    userCount:0,

    articleCount:0,
     
    categoryCount:0,

    publishArticleCount:0,

    draftArticleCount:0,

    publishTrend:[],

    recentArticles:[],

    categoryTrend:[]

})
  useEffect(()=>{
       getCategoryList().then(res=>{
        setCategories(res.list)
       })

       getDashborad().then(res=>{
        setDashboardData(res)
       })
  },[])
    
  // 统计折线图
    const chartData = dashboardData.publishTrend.map(item=>({
       date:item.date,

      count:item.count

    }))

  // 全部文章数量
  const articleCount = dashboardData.articleCount
  // 分类数量
  const categoryCount = dashboardData.categoryCount
  
  // 分类饼图
   const piedata = dashboardData.categoryTrend.map(item=>({
        
    name:item.name,

    value:item.value
   }))
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
      dataIndex:"createTime",
      render:(time:string)=>{
        return dayjs(time).format("YYYY-MM-DD")
      }
    }
  ]


  return (
    <div className="dashboard">
       <h2>欢迎回来,管理员</h2>
      <Row gutter={16}> 
       {/* 文章 */}
       <Col span={8}>
       <Card>
        <Statistic title="文章数量" value={articleCount} prefix={<FileTextOutlined/>} />
       </Card>
       </Col>
       
       {/* 用户 */}
       <Col span={8}>
       <Card>
        <Statistic title="用户数量" value={dashboardData.userCount} prefix={<UserOutlined/>} />

       </Card>
       </Col>

        {/* 分类 */}
       <Col span={8}>
       <Card>
        <Statistic title="分类数量" value={categoryCount} prefix={<AppstoreOutlined/>} />
       </Card>
       </Col>
      </Row>
       
       {/* 发布文章 */}
      <Row gutter={16} style={{marginTop:16}}>
        <Col span={8}>
         <Card>
          <Statistic title="已发布文章" value={dashboardData.publishArticleCount} prefix={<CheckCircleOutlined />} />
         </Card>
        </Col>

        {/* 草稿文章 */}
        <Col span={8}>
        <Card>
         <Statistic title="草稿文章" value={dashboardData.draftArticleCount} prefix={<EditOutlined/>}/>
        </Card>
        </Col>
      </Row>

       <Card title="最近发布的文章" className='article-card'>
       <Table columns={columns} dataSource={dashboardData.recentArticles} pagination={false} rowKey="id">
       </Table>
       </Card>

       <Row gutter={16}>
        <Col span={12}>
       <Card title="数据趋势" className='chart-card'>
         <LineChart data={chartData}/>
       </Card>
       </Col>
        
        <Col span={12}>
       <Card title="文章分类占比" className='pie-chart-card'>
          <PieChart data={piedata}/>
       </Card>
       </Col>
       </Row>
    </div>
  )

}