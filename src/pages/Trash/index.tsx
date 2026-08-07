import { Table,Button,Popconfirm,Tag,message,Space} from "antd"
import { useSelector,useDispatch } from "react-redux"
import { forceDeleteArticle,updateArticle } from "../../store/modules/article"
import type { ArticleType } from "../../types/article"
import type { RootState } from "../../store"
import "./index.scss"
export default function Trash(){
  const dispatch = useDispatch()
  const trashArticles = useSelector((state:RootState)=>state.article.list.filter((item:ArticleType)=>item.status==="trash"))
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
  return(
    <div className="trash-page">
      <h2>回收站</h2>
      <Table dataSource={trashArticles} columns={columns} rowKey="id"/>
    </div>
  )
}