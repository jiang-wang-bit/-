import { CommentType } from "./types"
import {data} from "./mock"
import "./index.scss"
import { Table,Tag,Button,Card} from "antd"
import { render } from "@testing-library/react"
export default function Comment(){
  const columns = [{
    title:"文章",
    dataIndex:"articleTitle"
  },
  {
    title:"评论用户",
    dataIndex:"username"
  },
  {
    title:"评论内容",
    dataIndex:"content"
  },
  {
   title:"状态",
   dataIndex:"status",
   render:(status:string)=>{
    return status==="通过" ? <Tag color="green">通过</Tag>:<Tag color="orange">待审核</Tag>
   }
  },
  {
    title:"操作",
    render:()=>{
      return (
        <Button danger size="small">删除</Button>
      )
    }
  }
]
  return (
    <div className="comment-page">
    <Card title="评论管理">
     <Table columns={columns} dataSource={data} rowKey="id"></Table>
    </Card>
    </div>
  )
}