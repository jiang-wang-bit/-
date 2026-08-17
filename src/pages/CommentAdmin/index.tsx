import { CommentType } from "./types"
import "./index.scss"
import { Table,Tag,Button,Popconfirm, message} from "antd"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import type { RootState } from "../../store"
import { setComments } from "../../store/modules/comment"
import { getAllComments,updateCommentStatus,deleteComment } from "../../api/comment"
export default function Comment(){
  const dispatch = useDispatch()
  useEffect(()=>{
   getAllComments().then(res=>{
    dispatch(setComments(res))
   })
  },[dispatch])
  const datalist = useSelector((state:any)=>state.comment.list)
  const columns = [{
    title:"文章",
    dataIndex:"article_title"
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
    return status==="normal" ? <Tag color="green">通过</Tag>:<Tag color="orange">待审核</Tag>
   }
  },
  {
    title:"操作",
    render:(_:any,record:CommentType)=>{
      return (
        <>
        {
          record.status==="pending"&&
          <Button type="primary" size="small" onClick={async()=>{await updateCommentStatus(record.id,"normal")
        message.success("审核通过")
        getAllComments().then(res=>{
          dispatch(setComments(res))
        })}}>通过</Button>
        }

      <Popconfirm title="删除评论" description="确定删除这条评论吗?" okText="确定" cancelText="取消" onConfirm={async()=>{await deleteComment(record.id)
       message.success("删除成功")
       getAllComments().then(res=>{
        dispatch(setComments(res))
       })}}>
        <Button danger size="small">删除</Button>
        </Popconfirm>
        </>
      )
    }
  }
]
  return (
    <div className="comment-page">
     <h2>评论管理</h2>
     <Table columns={columns} dataSource={datalist} rowKey="id"></Table>
    </div>
  )
}