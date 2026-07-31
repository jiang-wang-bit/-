import type {User,UserSearchParams} from "../../types/user"
import "./index.scss"
import {Space,Button,Empty,Popconfirm,Tag,message,Table} from "antd"
import { useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import UserSearch from "./components/UserSearch"
import { getUserList,deleteUser } from "../../api/user"

export default function User(){
  const navigate = useNavigate()
  const [users,setUsers] = useState<User[]>([])
  const [loading,setLoading] = useState(false)
  // 获取用户列表
  const loadUsers = async(params?:UserSearchParams)=>{
    try{
       setLoading(true)
       const res = await getUserList(params)
       setUsers(res)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    loadUsers()
  },[])
  
  // 搜索函数
  const handleSearch = (values:UserSearchParams)=>{
    loadUsers(values)
  }
  // 删除用户
  const handleDelete = async(id:number)=>{
    await deleteUser(id)
    message.success("删除成功")
    loadUsers()
  }
const columns = [
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
      role==="管理员"?<Tag color="blue">管理员</Tag>:<Tag >普通用户</Tag>
    )
  },
  {
    title:"状态",
    dataIndex:"status",
    key:"status",
    render:(status:string)=>(
      status==="正常"?<Tag color="green">正常</Tag>:<Tag color="red">禁用</Tag>
    )
  },
  {
    title:"创建时间",
    dataIndex:"createTime",
    key:"createTime"
  },
  {
    title:"操作",
    render:(_:any,record:User)=>(
      <Space>
       <Button type="link" onClick={()=>navigate(`/admin/user/edit/${record.id}`)}>
        编辑
       </Button>
       
       <Popconfirm title="确定删除该用户吗?" onConfirm={()=>handleDelete(record.id)}>
       <Button type="link" danger>
        删除
       </Button>
       </Popconfirm>
      </Space>
    )
  }
]
  return (
    <div className="user-page">
  
      <div className="user-title">
      <h2>用户管理</h2>
      <UserSearch onSearch={handleSearch}/>
      <Button type="primary" onClick={()=>navigate("create")}>新增用户</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={users} loading={loading} locale={{emptyText:<Empty description="暂无用户"/>}}/>
    </div>
  )
}