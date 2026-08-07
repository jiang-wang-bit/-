import { Table,Button,Popconfirm,Tag,message,Space,Dropdown} from "antd"
import { useSelector,useDispatch } from "react-redux"
import { useState } from "react"
import { forceDeleteArticle,updateArticle } from "../../store/modules/article"
import type { ArticleType } from "../../types/article"
import type { RootState } from "../../store"
import "./index.scss"
export default function Trash(){
  const dispatch = useDispatch()
  const [selectedRowKeys,setSelectedRowKeys] = useState<number[]>([])
  const trashArticles = useSelector((state:RootState)=>state.article.list.filter((item:ArticleType)=>item.status==="trash"))
   const selectedArticles = trashArticles.filter(item=>selectedRowKeys.includes(item.id))
  const restore = (article:ArticleType)=>{
    dispatch(
      updateArticle(
        {
          ...article,
          status:article.beforeDeleteStatus||"draft"
        }
      )
    )
    message.success("恢复成功")
  }
  // 批量恢复：
  const handleBatchRestore=()=>{
     if(selectedArticles.length===0){
      message.warning("请选择文章")
      return
     }
     selectedRowKeys.forEach(id=>{

      const article =
      trashArticles.find(
        item=>item.id===id
      )
      if(article){
        dispatch(
          updateArticle({
            ...article,
            status:
            article.beforeDeleteStatus || "draft"
          })
        )
      }
    })
     message.success(`恢复${selectedRowKeys.length}篇文章`)
     setSelectedRowKeys([])
  }
  // 批量删除
  const handleBatchForceDelete=()=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择文章")
      return
    }
    selectedRowKeys.forEach(id=>
      dispatch(forceDeleteArticle(id))
    )
     message.success(
    `永久删除${selectedRowKeys.length}篇文章`
    )

  setSelectedRowKeys([])
  }

  const columns = [
    {
       title:"ID",
      dataIndex:"id"
    },
    {
      title:"标题",
      dataIndex:"title"
    },
    {
      title:"作者",
      dataIndex:"author"
    },
    {
      title:"状态",
      render:()=>(
        <Tag color="red">回收站</Tag>
      )
    },
    {
      title:"操作",
      render:(record:ArticleType)=>(
        <>
        <Space>
        <Button size="small" onClick={()=>restore(record)}>恢复</Button>
        <Popconfirm title="确定永久删除吗?" onConfirm={()=>dispatch(forceDeleteArticle(record.id))}>
            <Button danger size="small">永久删除</Button>
        </Popconfirm>
        </Space>
        </>
      )
    }
  ]
  const batchItems = [
    {
      key:"delete",
      label:"批量删除"
    },
    {
      key:"restore",
      label:"批量恢复"
    }
  ]
  return(
    <div className="trash-page">
      <div className="trash-page-title">
           <h2>回收站</h2>
        { selectedRowKeys.length>0&&(
          <>
          <div className="action">
      <span>已选择{selectedRowKeys.length}篇文章</span>
      <Dropdown menu={{items:batchItems,
      onClick:({key})=>{
        if(key==="delete"){
          handleBatchForceDelete()
        }
        if(key==="restore"){
          handleBatchRestore()
        }
      }}}>
        <Button>批量操作</Button>
      </Dropdown>
      </div>
      </>
      )
       }
      </div>
      <Table dataSource={trashArticles} columns={columns} rowKey="id" rowSelection={{selectedRowKeys,
        onChange:(keys)=>{
          setSelectedRowKeys(
            keys.map(key=>Number(key))
          )
        }
      }}/>
    </div>
  )
}