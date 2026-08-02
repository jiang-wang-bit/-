import {Tag} from "antd"
import {useState,useEffect} from "react"
import {getCategoryList} from "../../../../api/category"
import type {CategoryType} from "../../../../types/category"
import {useNavigate} from "react-router-dom"
interface Props{
  onChange:(id:number)=>void
}
export default function CategoryTabs({onChange}:Props){
   const [categories,setCategories] = useState<CategoryType []>([])
   const [active,setActive] = useState<number>(0)
   const navigate = useNavigate()
   useEffect(()=>{
    getCategoryList().then(res=>{
      setCategories(res)
    })
   },[]) 
  return(
    <div>
      <Tag color={active===0?"blue":""} onClick={()=>setActive(0)} style={{cursor:"pointer"}}>全部</Tag>
      {
        categories.map(item=>( 
          <Tag key={item.id} color={active===item.id?"blue":""} onClick={()=>{setActive(item.id); navigate(`/category/${item.id}`)}} style={{cursor:"pointer"}}>{item.name}</Tag>
        ))
      }
    </div>

  )

  }