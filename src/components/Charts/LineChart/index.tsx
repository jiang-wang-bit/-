import ReactECharts from "echarts-for-react";
export default function LineChart(){
  const option = {
    title:{
      text:"文章发布趋势"
    },
    tooltip:{
      trigger:"axis"
    },
    xAxis:{
      type:"category",
      data:[
        "7-20",
      "7-21",
      "7-22",
      "7-23",
      "7-24",
      "7-25"
      ]
    },
    yAxis:{
      type:"value"
    },
    series:[
      {
        name:"文章数量",
        type:"line",
        data:[
            5,
        8,
        12,
        18,
        25,
        32
        ],
        smooth:true
      }
    ]
  }
  return (
    <ReactECharts option={option} style={{height:"350px"}} />
  )
}