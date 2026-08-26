import { useEffect, useState } from "react";
import {
    Table,Input,Button,Tag,Space,message,Popconfirm,Dropdown,Modal
} from "antd"
import { getTrashComments,restoreComment,deletePermanent,batchDeletePermanent,batchRestoreComment } from "../../api/comment";
import dayjs from "dayjs";
import type { CommentType } from "../../types/comment";

export default function CommentTrash(){
   const [comments,setComments] = useState<CommentType[]>([])
   const [selectedRowKeys,setSelectedRowKeys]=useState<React.Key[]>([])
   const [page,setPage] = useState(1)

    const [pageSize,setPageSize] = useState(10)

    const [total,setTotal] = useState(0)

    const [keyword,setKeyword] = useState("")

    const [searchKeyword,setSearchKeyword] = useState("")

    const [loading,setLoading] = useState(false)
    // 获取回收站评论
   const loadTrashComments = async()=>{

    try{
    setLoading(true)
    const res = await getTrashComments({
        page,
        pageSize,
        keyword:searchKeyword
    })

    setComments(res.list)
    setTotal(res.total)

    }catch(err){

    message.error("获取回收站评论失败")

 }finally{
    setLoading(false)
 }

}

  useEffect(()=>{

    loadTrashComments()

},[
    page,
    pageSize,
    searchKeyword
])

  // 单独恢复
   const handleRestore=async(id:number)=>{

    await restoreComment(id)
    message.success(
    "恢复成功"
    )
    loadTrashComments()
    }

  // 单独删除
   
const handlePermanentDelete=async(id:number)=>{
    await deletePermanent(id)
    message.success(
    "彻底删除成功"
    )
    loadTrashComments()
    }

// 批量恢复
const handleBatchRestore=async(ids:number[])=>{


    await batchRestoreComment(ids)
    message.success(
    "批量恢复成功"
    )
    setSelectedRowKeys([])
    loadTrashComments()
    }

// 批量彻底删除
const handleBatchDelete=async(ids:number[])=>{

      await batchDeletePermanent(ids)
      message.success(
      "批量删除成功"
      )
      setSelectedRowKeys([])
      loadTrashComments()
}

// 批量菜单
const items=[
 {
  key:"restore",
  label:"批量恢复"
 },

 {
  key:"delete",
  label:"批量彻底删除",
  danger:true
 }
]

// 批量操作
const handleBatchAction=(key:string)=>{

      if(selectedRowKeys.length===0){

        message.warning(
        "请选择评论"
        )
        return

      }
      const ids=selectedRowKeys as number[]

      switch(key){
      case "restore":
        handleBatchRestore(ids)
      break

      case "delete":
      Modal.confirm({
        title:"确认永久删除?",
        content:"删除后无法恢复",
        onOk(){
          handleBatchDelete(ids)
        }
      })
      break
      }

      }

const columns=[
      {
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
      title:"删除状态",
      dataIndex:"status",
      render:()=>(
        <Tag color="red">
          已删除
        </Tag>
      )
      },
      {
      title:"删除时间",
      dataIndex:"create_time",
      render:(time:string)=>
      dayjs(time)
      .format("YYYY-MM-DD")
      },
      {
      title:"操作",

      render:(_:any,record:CommentType)=>(
      <Space>

      <Button
      type="primary"
      onClick={()=>
      handleRestore(record.id)
      }
      >
      恢复
      </Button>

      <Popconfirm

      title="确认永久删除?"
      description="删除后无法恢复"
      onConfirm={()=>
      handlePermanentDelete(record.id)
      }
      >
      <Button danger>
      彻底删除
      </Button>

      </Popconfirm>
      </Space> )
    } ]

   return (
        <div className="restore-page">
           
             <div className="restore-page-header">
            <h2>
                评论回收站
            </h2>

            {/* 搜索框 */}
            <Input placeholder="搜索评论内容" value={keyword} style={{width:200}}
            onChange={(e)=>{
                setKeyword(e.target.value)
            }}/>


             {/* 查询按钮 */}
            <Button type="primary" onClick={()=>{
            setSearchKeyword(keyword)
            setPage(1)
            }}>查询</Button>

            {/* 重置按钮 */}
            <Button onClick={()=>{
                setKeyword("")
                setSearchKeyword("")
                setPage(1)
            }}>重置</Button>

            <Dropdown menu={{
                items:items,
                onClick:({key})=>{
                    handleBatchAction(key)
                }
            }}>
                <Button disabled={selectedRowKeys.length===0}>批量操作 ▼</Button>
            </Dropdown>
            </div>


            <Table

                rowKey="id"

                loading={loading}

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
                        return  `共${total}条评论`
                    },
                    onChange:(current,size)=>{
                       setPage(current)
                       setPageSize(size)
                    }
                }}

                columns={columns}

                dataSource={comments}

            />

        </div>

    )
}