import {Card,message} from "antd"
import { useNavigate } from "react-router-dom"
import "./index.scss"
import CategoryForm from "./components/CategoryForm"
import {createCategory} from "../../api/category"
interface FormValues{
  name:string
}
export default function CreateCategory(){
  const navigate = useNavigate()
  // 提交
  const handleSubmit = async(values:FormValues)=>{
    try{
      await createCategory({
        name:values.name
      })
      message.success("新增成功")
      navigate("/admin/category")
    }catch(err:any){
       console.log("错误对象:",err)

  console.log(
    "返回数据:",
    err.response?.data
  )
       message.error(err.response?.data?.detail || "创建失败")
    }
  }


  return(
    <div className="category-form">
      <Card title="新增分类">
    <CategoryForm onSubmit={handleSubmit}/>
      </Card>
      </div>
  )
}