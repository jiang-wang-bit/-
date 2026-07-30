import {Card,message} from "antd"
import { useEffect,useState } from "react"
import { useNavigate,useParams } from "react-router-dom"
import CategoryForm from "./components/CategoryForm"
import { getCategoryDetail,updateCategory } from "../../api/category"
interface FormValues{
  name:string
}
export default function EditCategory(){
  const navigate = useNavigate()
 const {id} = useParams()
 const categoryId = Number(id)
  const [initialValues,setinitailValues] = useState<FormValues>()
  useEffect(()=>{
      const load = async()=>{
        const res = await getCategoryDetail(categoryId)
        if(res){
          setinitailValues({name:res.name})
        }
      }
      load()
  },[categoryId])
  const handleSubmit = async(values:FormValues)=>{
     try{
       await updateCategory(categoryId,values)
       message.success("修改成功")
       navigate("/admin/category")
     }catch(err)
     {
      message.error("修改失败")
     }
  }
  return(
    <div className="category-edit" style={{padding:24}}>
    <Card title="修改分类">
      {
        initialValues&&(
          <CategoryForm initialValue={initialValues} onSubmit={handleSubmit} />
        )
      }
    </Card>
    </div>
  )
}