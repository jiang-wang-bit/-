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
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { getCategoryList } from '../../api/category';
import { useState,useEffect } from 'react';
import type { CategoryType } from '../../types/category';
import PieChart from '../../components/Charts/pieCharts';
import type { ArticleType } from '../../types/article';
export default function Dashboard(){
  // 获取文章
  const articles = useSelector((state:any)=>state.article.list as ArticleType[])
  // 已发布文章
  const publishArticles = articles.filter(item=>item.status==="published")
  // 发布文章趋势数据
   const trendMap = publishArticles.reduce((acc:Record<string, number>,item)=>{
    const date = dayjs(item.createTime).format("YYYY-MM-DD")
    // 数量累加
    acc[date] = (acc[date] || 0) +1
    return acc
   },{})
  //  获取分类
  const [categories,setCategories] = useState<CategoryType[]>([])
  useEffect(()=>{
       getCategoryList().then(res=>{
        setCategories(res)
       })
  },[])

    const chartData = Object.keys(trendMap).map(date=>({
      date,
      count:trendMap[date]
    }))

  // 草稿文章
  const draftArticles = articles.filter(item=>item.status==="draft")
  // 全部文章数量
  const articleCount = articles.length
  // 分类数量
  const categoryCount = categories.length
  // 分类统计
   const categoryMap = articles.reduce((acc:any,item)=>{
    const category = categories.find(c=>c.id===item.categoryId)
    if(category){
      acc[category.name] = (acc[category.name]||0) +1
    }
    return acc
   },{})
   const piedata = Object.keys(categoryMap).map(item=>({
      name:item,
      value:categoryMap[item]
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
  // 同步最近发布的文章
  const data = [...publishArticles].sort(
    (a,b)=>
     dayjs(b.createTime).unix()-dayjs(a.createTime).unix()
  ).slice(0,5)

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
        <Statistic title="用户数量" value={67} prefix={<UserOutlined/>} />

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
          <Statistic title="已发布文章" value={publishArticles.length} prefix={<CheckCircleOutlined />} />
         </Card>
        </Col>

        {/* 草稿文章 */}
        <Col span={8}>
        <Card>
         <Statistic title="草稿文章" value={draftArticles.length} prefix={<EditOutlined/>}/>
        </Card>
        </Col>
      </Row>

       <Card title="最近发布的文章" className='article-card'>
       <Table columns={columns} dataSource={data} pagination={false} rowKey="id">
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