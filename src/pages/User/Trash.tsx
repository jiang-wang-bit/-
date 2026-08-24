import { useEffect, useState } from "react";
import { getTrashUsers,restoreUser,deleteUserPermanently } from "../../api/user1";
import {
    Table,Button,Tag,Space,message,Popconfirm
} from "antd"
import type {User} from "../../types/user"
import dayjs from "dayjs";
export default function TrashUser(){
  const [users,setUsers] = useState<User[]>([])
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
                    {status}
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

            <h2>
                用户回收站
            </h2>


            <Table

                rowKey="id"

                columns={columns}

                dataSource={users}

            />


        </div>

    )

}


