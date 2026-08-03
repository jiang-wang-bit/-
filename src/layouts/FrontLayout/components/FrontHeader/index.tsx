import { Menu } from "antd"
import { useNavigate } from "react-router-dom"
import "./index.scss"
export default function FrontHeader(){
  const navigate = useNavigate()
  const items = [
    {
      key:"/",
      label:"首页"
    },
    {
      key:"/article",
      label:"文章"
    },
    {
      key:"/category",
      label:"分类"
    },
    {
      key:"/user/favorite",
      label:"我的收藏"
    },
    {
      key:"/user",
      label:"用户中心"
    }
  ]
  return(
    <header className="front-header">
      <div className="logo">my logo</div>
      <Menu mode="horizontal" items={items} onClick={({key})=>navigate(key)}/>
    </header>
  )
}