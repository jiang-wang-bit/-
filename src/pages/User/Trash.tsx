import { useEffect, useState } from "react";
import { getTrashUsers,restoreUser,deleteUserPermanently,batchDeletePermanent,batchRestoreUser } from "../../api/user1";
import {
    Table,Button,Tag,Space,message,Popconfirm,Dropdown,Modal
} from "antd"
import type {User} from "../../types/user"
import dayjs from "dayjs";
export default function TrashUser(){
  const [users,setUsers] = useState<User[]>([])
  const [selectedRowKeys,setSelectedRowKeys] = useState<React.Key[]>([])
  
  const loadUsers = async()=>{
    const res = await getTrashUsers()
    setUsers(res.list)
  }

  useEffect(()=>{
    loadUsers()
  },[])

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
       await batchDeletePermanent(ids)

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


