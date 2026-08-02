import {Input} from "antd"
import {useState} from "react"
interface Props{
  onSearch:(keyword:string)=>void
}

export default function ArticleSearch({onSearch}:Props){
  const [keyword,setKeyword] = useState("")
  return(
    <Input placeholder="搜索文章" value={keyword} style={{width:300}} onChange={(e)=>{
      const value= e.target.value
      setKeyword(value)
      onSearch(value)
    }}></Input>
  )
}