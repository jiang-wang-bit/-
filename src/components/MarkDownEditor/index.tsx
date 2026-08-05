import MDEditor from "@uiw/react-md-editor"
import imageCompression from "browser-image-compression"
import { Button,message } from "antd"
import { useRef } from "react"
interface Props{
  value:string
  onChange:(value:string)=>void
}
export default function MarkDownEditor({value,onChange}:Props){
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadImage = ()=>{
    inputRef.current?.click()
  }
  const handleFile = async( e:React.ChangeEvent<HTMLInputElement>)=>{
   const file = e.target.files?.[0]
   if(!file) return
   if(!file.type.startsWith("image")){
    message.error("只能上传图片")
    return
   }
   const compressed = await imageCompression(file,{
    maxSizeMB:0.5,
    maxWidthOrHeight:800
   })
   const reader = new FileReader()
   reader.onload=()=>{
    const url = reader.result as string
    const markdown = `${value}\n\n![图片](${url})`
    onChange(markdown)
   }
   reader.readAsDataURL(compressed)
  }
  return(
    <div>
      <Button onClick={uploadImage}>
        上传图片
    </Button> 
    <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
    <MDEditor value={value} onChange={(v)=>onChange(v||"")}/>
    </div>
  )
}