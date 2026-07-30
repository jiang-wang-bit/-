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
    }catch(err){
       message.error("新增失败")
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