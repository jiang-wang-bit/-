import { Tooltip } from "antd";
import ReactEcharts from "echarts-for-react"
interface Props{
  data:{
    name:string;
    value:number
  }[]
}
export default function PieChart({data}:Props){
  const option = {
    tooltip:{
      trigger:"item"
    },
    legend:{
    top:"5%"
    },
    series:[
      {
        name:"文章分类",
        type:"pie",
        radius:"50%",
        data:data
      }
    ]
  }

  return(
    <ReactEcharts option={option} style={{height:"300px"}}/>
  )
}