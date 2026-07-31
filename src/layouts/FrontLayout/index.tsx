import { Outlet } from "react-router-dom"
import FrontFooter from "./components/FrontFooter"
import FrontHeader from "./components/FrontHeader"
import "./index.scss"
export default function FrontLayout(){
  return(
    <div className="front-layout">
        <FrontHeader />
        <main className="front-content">
           <Outlet />
        </main>
        <FrontFooter/>
    </div>
  )
}