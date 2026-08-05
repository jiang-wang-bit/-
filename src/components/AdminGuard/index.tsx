
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
interface Props{
  children:React.ReactNode
}
export default function AdminGuard({children}:Props){
  const userInfo = useSelector((state:RootState)=>state.user.userInfo)
  if(userInfo?.role!=="admin"){
    return(
      <div>无权限访问</div>
    )

  }
 return (<>{children} </>)

}