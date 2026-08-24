import type {User,UserSearchParams} from "../../types/user"
import "./index.scss"
import {Space,Button,Empty,Popconfirm,Tag,message,Table, Dropdown} from "antd"
import { useNavigate } from "react-router-dom"
import { useState,useEffect } from "react"
import dayjs from "dayjs"
import UserSearch from "./components/UserSearch"
import { getUserList } from "../../api/user1"
import { deleteUser,restoreUser,disableUser,enableUser,resetPassword,batchDeteleUser,batchDisableUser,batchEnableUser} from "../../api/user1"
export default function User(){
  const navigate = useNavigate()
  const [users,setUsers] = useState<User[]>([])
  const [total,setTotal] = useState(0)
  const [page,setPage] = useState(1)
  const [pageSize,setPageSize] = useState(10)
  const [loading,setLoading] = useState(false)
  const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([])
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

  // 禁用和启用用户
  const handleChangeStatus = async(id:number,status:string)=>{
    try{
      if(status==="active"){
        await disableUser(id)
        message.success("用户已禁用")
      }
      else{
        await enableUser(id)
        message.success("用户已启用")
      }
      loadUsers()

    }catch(err){
      message.error("操作失败")
    }
  }

  
  // 重置密码
  const handleResetPassword =async (id:number)=>{
    try{
      const res = await resetPassword(id)
      message.success(`密码已重置：${res.password}`)
    }catch(err)
    {
      message.error("重置失败")
    }
  }


  const getUserActions = (record:User)=>{
    const items = [
      {
        key:"edit",
        label:"编辑"
      },
      record.status==="active"?
      {
        key:"disable",
        label:"禁用"
      }:
      {
        key:"enable",
        label:"启用"
      },
      {
        key:"resetPassword",
        label:"重置密码"
      },
      {
        key:"delete",
        label:"删除",
        danger:true
      }
    ]
    return items
  }

  const handleAction = (key:string,record:User)=>{
   switch(key){
    case "edit":
      navigate(`/admin/user/edit/${record.id}`)
      break
    case "disable":
      handleChangeStatus(record.id,record.status)
      break
    case "enable":
      handleChangeStatus(record.id,record.status)
      break
    case "delete":
      handleDelete(record.id)
      break
    case "resetPassword":
     handleResetPassword(record.id)
      break
   }
  

  }

  // 批量禁用
  const batchDisable=async(ids:number[])=>{

  try{

    await batchDisableUser(ids)

    message.success(
      "批量禁用成功"
    )

    loadUsers()

    setSelectedRowKeys([])

  }catch{

    message.error(
      "操作失败"
    )

  }

  }

  //  批量启用
  const batchEnable=async(ids:number[])=>{

  await batchEnableUser(ids)

  message.success(
    "批量启用成功"
  )

  loadUsers()

  setSelectedRowKeys([])

  }

  // 批量删除
  const batchDelete=async(ids:number[])=>{

  await batchDeteleUser(ids)

  message.success(
    "已移动到回收站"
  )

  loadUsers()

  setSelectedRowKeys([])

  }

  // 批量操作
  const getBatchAction=()=>{
    return[
      {
        key:"batchDisable",
        label:"批量禁用"
      },
      {
        key:"batchEnable",
        label:"批量启用"
      },
      {
        key:"batchDelete",
        label:"批量移入回收站",
        danger:true
      }
    ]
  }

  // 批量点击处理
  const handleBatchAction = (key:string)=>{
    if(selectedRowKeys.length===0){
      message.warning("请选择用户")
      return
    }
    const ids = selectedRowKeys as number[]
    switch(key){
      case "batchDisable":
        batchDisable(ids)
        break
      case "batchEnable":
        batchEnable(ids)
        break
      case "batchDelete":
        batchDelete(ids)
        break
    }
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
      <Dropdown menu={{items:getUserActions(record),
        onClick:({key})=>{
         handleAction(key,record)
        }
      }}>
       <Button size="small">更多 ▼</Button>
      </Dropdown>
    )

  }]


  return (
    <div className="user-page">
  
      <div className="user-title">
      <h2>用户管理</h2>
      <UserSearch onSearch={handleSearch}/>
      <Space>
      <Button type="primary" onClick={()=>navigate("trash")}>回收站</Button>
      <Button type="primary" onClick={()=>navigate("create")}>新增用户</Button>
      <Dropdown menu={{items:getBatchAction(),
        onClick:({key})=>{
          handleBatchAction(key)
        }
      }}>
        <Button disabled={selectedRowKeys.length===0}>批量操作 ▼</Button>
      </Dropdown>
      </Space>
      </div>
      <Table rowKey="id" 
      rowSelection={{selectedRowKeys,
        onChange:(keys)=>{
          setSelectedRowKeys(keys)
        }
      }}
      pagination={{current:page,pageSize,total, showSizeChanger:true,onChange:(current,size)=>{
       if(size!==pageSize){
        setPage(1)
       }else{
        setPage(current)
       }
      }}} columns={columns} dataSource={users} loading={loading} locale={{emptyText:<Empty description="暂无用户"/>}}/>
    </div>
  )
}