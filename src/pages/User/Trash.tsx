import { useEffect, useState } from "react";
import { getTrashUsers,restoreUser } from "../../api/user1";
import {
    Table,Button,Tag,Space,message
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


