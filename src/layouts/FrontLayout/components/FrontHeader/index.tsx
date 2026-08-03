import { Menu } from "antd"
import { useNavigate } from "react-router-dom"
import "./index.scss"
import { lazy } from "react"
export default function FrontHeader(){
  const navigate = useNavigate()
  const items = [
    {
      key:"/",
      label:"首页"
    },
    {
      key:"article",
      label:"文章"
    },
    {
      key:"category",
      label:"分类"
    },
    {
      key:"favorite",
      label:"我的收藏"
    }
  ]
  return(
    <header className="front-header">
      <div className="logo">my logo</div>
      <Menu mode="horizontal" items={items} onClick={({key})=>navigate(key)}/>
    </header>
  )
}