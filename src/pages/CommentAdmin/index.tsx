import { CommentType } from "./types"
import { useRef } from "react"
import "./index.scss"
import { Table,Tag,Select,Button,Popconfirm, message,Dropdown, Space,Input} from "antd"
import { useDispatch,useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setComments } from "../../store/modules/comment"
import { getAllComments,updateCommentStatus,deleteComment,batchApprove,batchDelete } from "../../api/comment"
export default function Comment(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([])
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const [total,setTotal] = useState(0)
  const [keyword,setKeyWord] = useState("")
  const [status,setStatus]=useState<string|undefined>(undefined)
  const [searchKeyword,setSearchKeyword] = useState("")
const [searchStatus,setSearchStatus] = useState<string|undefined>(undefined)

  const loadComments = async()=>{
     try{
   const res = await getAllComments({
    page,pageSize,keyword:searchKeyword,status:searchStatus
   })
   dispatch(
    setComments(res.list)
   )
   setTotal(res.total)

 }catch(err){
   message.error("获取评论失败")

 }
  }

  useEffect(()=>{
   loadComments()
  }, [page,
 pageSize,
 searchKeyword,
 searchStatus])

  const datalist = useSelector((state:any)=>state.comment.list)

  // 单个通过
  const handleApprove =async(id:number)=>{
        try{

      await updateCommentStatus(
        id,
        "normal"
      )
      message.success(
        "审核通过"
      )
      loadComments()

    }catch(err){

      message.error(
        "审核失败"
      )

    }
      }

  // 单个删除
  const handleDeleteComment = async(id:number)=>{
        try{

      await deleteComment(id)
      message.success(
      "删除成功"
      )
      loadComments()
    }catch(err){
      message.error(
      "删除失败"
      )

    }
      }

  // 批量通过
  const handleBatchApprove= async(ids:number[])=>{
    try{
        await batchApprove(ids)
        message.success("批量审核通过")
        loadComments()
        setSelectedRowKeys([])
    }catch(err){
      message.error("批量审核通过失败")
    }
  }
  // 批量删除
  const handleBatchDelete = async(ids:number[])=>{
    try{
      await batchDelete(ids)
      message.success("批量删除成功")
       loadComments()
      setSelectedRowKeys([])

    }catch(err){
      message.error("批量删除失败")
    }
  }


  // 批量菜单
  const getBatchActions=()=>[

 {
   key:"approve",
   label:"批量审核通过"
 },

 {
   key:"delete",
   label:"批量删除",
   danger:true
 }

]

//  批量处理
const handleBatchActions=(key:string)=>{
  if(selectedRowKeys.length===0){
 message.warning("请选择评论")
 return
}
  const ids = selectedRowKeys as number[]
   switch(key){
  case "approve":
    handleBatchApprove(ids)
    break
  case "delete":
    handleBatchDelete(ids)
    break
  }
}


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
          <Button type="primary" size="small" 
          onClick={()=>handleApprove(record.id)}>通过</Button>
        }

      <Popconfirm title="删除评论" description="确定删除这条评论吗?" okText="确定" cancelText="取消" 
      onConfirm={()=>handleDeleteComment(record.id)}>
        <Button danger size="small">删除</Button>
        </Popconfirm>
        </>
      )
    }
  }
]
  return (
    <div className="comment-page">

      <div className="comment-header">
     <h2>评论管理</h2> 

     
     {/* 搜索 */}
     <Input placeholder="搜索评论内容" value={keyword} onChange={(e)=>setKeyWord(e.target.value)} style={{width:200}}/>
    
     {/* 状态筛选 */}
     <Select  placeholder="评论状态" value={status} allowClear style={{width:200}} onChange={(value)=>{setStatus(value||"")
     }} options={[{value:"normal",label:"已通过"},{value:"pending",label:"待审核"}]}></Select>
     
     {/* 查询按钮 */}
     <Button type="primary" onClick={()=>{
      setSearchKeyword(keyword)
      setSearchStatus(status)
      setPage(1)
     }}>查询</Button>

     {/* 重置按钮 */}
     <Button onClick={()=>{
      setKeyWord("")
      setStatus(undefined)
      setSearchKeyword("")
      setSearchStatus(undefined)
      setPage(1)
     }}>
      重置
     </Button>
     
     <Space>
    <Button type="primary" onClick={()=>navigate("trash")}>回收站</Button>
    <Dropdown menu={{
        items:getBatchActions(),
        onClick:({key})=>{
            handleBatchActions(key)
        }
    }}>
        <Button disabled={selectedRowKeys.length===0}>批量操作 ▼</Button>
    </Dropdown>
    </Space>

    </div>
    
     <Table columns={columns} 
     rowSelection={{
      selectedRowKeys,
      onChange:(keys)=>{
        setSelectedRowKeys(keys)
      }
     }}

     pagination={{
      current:page,
      pageSize:pageSize,
      total:total,
      showSizeChanger:true,
      showTotal:(total)=>{
        return`共${total}条评论`
      },
      onChange:(current,size)=>{
        setPage(current)
        setPageSize(size)
      }
     }}
     dataSource={datalist} 
     rowKey="id"
     ></Table>
    </div>
  )
}