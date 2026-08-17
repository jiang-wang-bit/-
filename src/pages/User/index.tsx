import type {User,UserSearchParams} from "../../types/user"
import "./index.scss"
import {Space,Button,Empty,Popconfirm,Tag,message,Table} from "antd"
import { useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import dayjs from "dayjs"
import UserSearch from "./components/UserSearch"
// import { deleteUser } from "../../api/user"
import { getUserList } from "../../api/user1"
import { deleteUser,restoreUser } from "../../api/user1"
export default function User(){
  const navigate = useNavigate()
  const [users,setUsers] = useState<User[]>([])
  const [total,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const [loading,setLoading] = useState(false)
  const [searchParams,setSearchParams] = useState<UserSearchParams>({})
  // 获取用户列表
  const loadUsers = async()=>{
    try{
       setLoading(true)
       const res = await getUserList({
        page,
        pageSize,
        ...searchParams
       })
       setUsers(res.list)
       setTotal(res.total)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    loadUsers()
  },[page,pageSize,searchParams])


  // 搜索函数
  const handleSearch = (values:UserSearchParams)=>{
     setSearchParams(values)
     setPage(1)
  }

  // 删除用户
  const handleDelete = async(id:number)=>{
    await deleteUser(id)
    message.success("删除成功")
    if(users.length===1&&page>1){
      setPage(page-1)
    }
    loadUsers()
  }

  // 恢复用户
  const handleRestore = async(id:number)=>{
    await restoreUser(id)
    message.success("恢复成功")
    loadUsers()
  }
const columns = [
  {
    title:"序号",
    render:(_:any,__:User,index:number)=>index+1
  },
  {
    title:"ID",
    dataIndex:"id",
    key:"id"
  },
  {
    title:"用户名",
    dataIndex:"username",
    key:"username"
  },
  {
    title:"邮箱",
    dataIndex:"email",
    key:"email"
  },
  {
    title:"角色",
    dataIndex:"role",
    key:"role",
    render:(role:string)=>(
      role==="admin"?<Tag color="blue">admin</Tag>:<Tag >user</Tag>
    )
  },
  {
    title:"状态",
    dataIndex:"status",
    key:"status",
    render:(status:string)=>(
      status==="active"?<Tag color="green">正常</Tag>:<Tag color="red">禁用</Tag>
    )
  },
  {
    title:"创建时间",
    dataIndex:"create_time",
    key:"create_time",
    render:(time:string)=>{
      return dayjs(time).format("YYYY-MM-DD")
    }
  },
  {
    title:"操作",
    render:(_:any,record:User)=>(
      <Space>
       <Button type="link" onClick={()=>navigate(`/admin/user/edit/${record.id}`)}>
        编辑
       </Button>
       
      {
        record.status==="active"?
         <Popconfirm title="确定删除该用户吗?" onConfirm={()=>handleDelete(record.id)}>
       <Button type="link" danger>
        删除
       </Button>
       </Popconfirm>:
       <Button type="link" onClick={()=>handleRestore(record.id)}>
          恢复
       </Button>
      }
      </Space>
    )
  }
]
  return (
    <div className="user-page">
  
      <div className="user-title">
      <h2>用户管理</h2>
      <UserSearch onSearch={handleSearch}/>
      <Space>
      <Button type="primary" onClick={()=>navigate("trash")}>回收站</Button>
      <Button type="primary" onClick={()=>navigate("create")}>新增用户</Button>
      </Space>
      </div>
      <Table rowKey="id" pagination={{current:page,pageSize,total, showSizeChanger:true,onChange:(current,size)=>{
       if(size!==pageSize){
        setPage(1)
       }else{
        setPage(current)
       }
      }}} columns={columns} dataSource={users} loading={loading} locale={{emptyText:<Empty description="暂无用户"/>}}/>
    </div>
  )
}