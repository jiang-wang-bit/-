import ReactECharts from "echarts-for-react";
interface Props{
  data:{
    date:string;
    count:number;
  }[]
}
// 对象解构
export default function LineChart({data}:Props){
  const option = {
    title:{
      text:"文章发布趋势"
    },
    tooltip:{
      trigger:"axis"
    },
    xAxis:{
      type:"category",
      data:data.map(item=>item.date)
    },
    yAxis:{
      type:"value"
    },
    series:[
      {
        name:"文章数量",
        type:"line",
        data:data.map(item=>item.count),
        smooth:true
      }
    ]
  }
  return (
    <ReactECharts option={option} style={{height:"300px"}} />
  )
}