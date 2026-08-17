import { getDeletedCategory,restoreCategory,forcedeleteCategory } from "../../api/category";
import {
    Table,Button,Tag,Space,message,Popconfirm
} from "antd"
import dayjs from "dayjs";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CategoryType } from "../../types/category";

export default function TrashCategory(){
    const navigate = useNavigate()
    const [categories,setCategories] = useState<CategoryType[]>([])
    const loadCategories = async()=>{
      const res = await getDeletedCategory()
      setCategories(res)
    }
    useEffect(()=>{
        loadCategories() 
    },[])
    // 恢复函数
    const handleRestore = async(id:number)=>{
      await restoreCategory(id)
      message.success("恢复成功")
      loadCategories()
    }
    // 彻底删除函数
    const handleforceCategory = async(id:number)=>{
        await forcedeleteCategory(id)
        message.success("永久删除成功")
        loadCategories()
    }
     const columns=[
    
            {
                title:"ID",
                dataIndex:"id"
            },

            {
                title:"分类名称",
                dataIndex:"name"
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
                        {status}</Tag>
    
                )
            },
            {
                title:"操作",
    
                render:(_:any,record:CategoryType)=>(
    
                    <Space>
    
                        <Button
                          type="primary"
                          size="small"
                          onClick={async()=>{try {
                            await handleRestore(record.id); 
                            navigate("/admin/category");      
                            } catch (error) {
                            message.error("恢复失败，请重试"); 
                            }
                        }}
                        >
                            恢复
                        </Button>
                    
                      <Popconfirm title="永久删除后无法恢复，确定吗?" onConfirm={()=>handleforceCategory(record.id)}>
                        <Button danger size="small">
                            永久删除
                        </Button>
                        </Popconfirm>

                    </Space>
    
                )
            }
    
        ]
    
    
    
        return (
    
            <div className="restore-page">
    
                <h2>
                    分类回收站
                </h2>

    
    
                <Table
    
                    rowKey="id"
    
                    columns={columns}
    
                    dataSource={categories}
    
                />
    
    
            </div>
    
        )
    
    }
    
    
    
