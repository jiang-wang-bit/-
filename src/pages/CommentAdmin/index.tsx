import { CommentType } from "./types"
import {data} from "./mock"
import "./index.scss"
import { Table,Tag,Button,Card,Popconfirm, message} from "antd"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import { setComments,deleteComments,updateStatus } from "../../store/modules/comment"
export default function Comment(){
  const dispatch = useDispatch()
  useEffect(()=>{
    if(data.length===0){
     dispatch(setComments(data))}
  },[dispatch])
  const datalist = useSelector((state:any)=>state.comment.list)
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
    render:(_:any,record:CommentType)=>{
      return (
        <>
        {
          record.status==="待审核"&&
          <Button type="primary" size="small" onClick={()=>{dispatch(updateStatus({id:record.id,status:"通过"}))
        message.success("审核通过")}}>通过</Button>
        }

      <Popconfirm title="删除评论" description="确定删除这条评论吗?" okText="确定" cancelText="取消" onConfirm={()=>{dispatch(deleteComments(record.id))
       message.success("删除成功")}}>
        <Button danger size="small">删除</Button>
        </Popconfirm>
        </>
      )
    }
  }
]
  return (
    <div className="comment-page">
    <Card title="评论管理">
     <Table columns={columns} dataSource={datalist} rowKey="id"></Table>
    </Card>
    </div>
  )
}