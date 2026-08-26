import { useEffect, useState } from "react";
import { getTrashUsers,restoreUser,deleteUserPermanently,batchDeletePermanent,batchRestoreUser } from "../../api/user1";
import {
    Table,Input,Button,Tag,Space,message,Popconfirm,Dropdown,Modal
} from "antd"
import type {User} from "../../types/user"
import dayjs from "dayjs";
import useTableQuery from "../../hooks/useTableQuery";
export default function TrashUser(){
  const [users,setUsers] = useState<User[]>([])
  const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([])
  const {page,pageSize,total,setPage,keyword,setKeyword,
        searchKeyword,loading,setLoading,setTotal,   handlePageChange,handleSearch,handleReset} = useTableQuery()
  
        // 获取回收站用户
  const loadUsers = async()=>{
    try{
      setLoading(true)
     const res = await getTrashUsers({
      page,page_size:pageSize,keyword:searchKeyword
     })
    setUsers(res.list)
    setTotal(res.total)
    }catch(err){
      console.log("获取用户失败",err)
    }finally{
      setLoading(false)
    }
  
  }

  useEffect(()=>{
    loadUsers()
  },[page,pageSize,searchKeyword])

  // 恢复函数
  const handleRestore = async(id:number)=>{
    await restoreUser(id)
    message.success("恢复成功")
    loadUsers()
  }

//   彻底删除函数
  const handleDetele = async(id:number)=>{
    await deleteUserPermanently(id)
    message.success("用户已经彻底删除")
    loadUsers()
  }

// 批量彻底删除
const handleBatchPermanent = async(ids:number[])=>{
   try{
     await batchDeletePermanent(ids)
     message.success("批量彻底删除成功")
     await loadUsers()
     setSelectedRowKeys([])
   }catch(err){
    message.error("批量彻底删除失败")
   }
}

// 批量恢复
const handleRestoreUser = async(ids:number[])=>{
  try{
    await batchRestoreUser(ids)
    message.success("批量恢复成功")
    loadUsers()
    setSelectedRowKeys([])
  }catch(err){
    message.error("批量恢复失败")
  }
}

//   抽离批量菜单
  const getBatchActions = ()=>{

    return [
        {
            key:"restore",
            label:"批量恢复"
        },
        {
            key:"permanentDelete",
            label:"批量彻底删除",
            danger:true
        }
    ]
  }

  const handleBatchAction = (key:string)=>{
    if(selectedRowKeys.length===0)
    {
         message.warning("请选择用户")
         return
    }
    const ids = selectedRowKeys as number[]
    switch(key){
      case "restore":
        handleRestoreUser(ids)
        break
      case "permanentDelete":
        Modal.confirm({

        title:"确认永久删除?",

        content:
        "删除后无法恢复",

       async onOk(){

        try{

        await batchDeletePermanent(ids)

        message.success(
        "批量删除成功"
        )

        setSelectedRowKeys([])

        loadUsers()

        }catch(err){

        message.error(
        "删除失败"
        )

        }

        }

})
        break

    }
  }
  const columns=[

        {
            title:"ID",
            dataIndex:"id"
        },


        {
            title:"用户名",
            dataIndex:"username"
        },


        {
            title:"邮箱",
            dataIndex:"email"
        },
        {
          title:"角色",
          dataIndex:"role",
          render:(role:string)=>(
            role==="admin"?<Tag color="blue">管理员</Tag>:<Tag >普通用户</Tag>
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
            title:"状态",
            dataIndex:"status",
            render:(status:string)=>(

                <Tag color="red">
                   回收站
                </Tag>

            )
        },


        {
            title:"操作",

            render:(_:any,record:User)=>(

                <Space>

                    <Button
                      type="primary"
                      onClick={()=>handleRestore(record.id)}
                    >
                        恢复
                    </Button>

                    <Popconfirm title="确定彻底删除这个用户吗？" description="删除后将无法恢复,请谨慎操作。" okText="确定删除" cancelText="取消" onConfirm={()=>handleDetele(record.id)}>
                      <Button danger>
                        彻底删除
                      </Button>
                    </Popconfirm>



                </Space>

            )
        }

    ]



    return (

        <div className="restore-page">
           
             <div className="restore-page-header">
            <h2>
                用户回收站
            </h2>

            <Input placeholder="请输入用户名或邮箱" value={keyword} onChange={(e)=>{setKeyword(e.target.value)} } style={{width:400}}/>


            <Space>
            {/* 搜索 */}
            <Button type="primary"onClick={handleSearch}>查询</Button>

            {/* 重置 */}
            <Button onClick={handleReset}>重置</Button>
            </Space>


            <Dropdown menu={{
                items:getBatchActions(),
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

                pagination={{
                  current:page,
                  pageSize:pageSize,
                  total:total,
                  showSizeChanger:true,
                  showTotal:(total)=>{
                    return`共${total}篇文章`
                  },
                  onChange:handlePageChange
                }}

                rowSelection={{
                    selectedRowKeys,
                    onChange:(keys)=>{
                        setSelectedRowKeys(keys)
                    }
                }}

                columns={columns}

                dataSource={users}

            />


        </div>

    )

}


