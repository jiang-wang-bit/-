import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Article from "../pages/Article";
import Category from "../pages/Category";
import User from "../pages/User";
import AdminLayout from "../layouts/AdminLayout";
import {Navigate} from "react-router-dom";

const router=createBrowserRouter([


  // 根路径
  {
    path:"/",
    element:
    <Navigate to="/login"/>
  },



  // 登录
  {
    path:"/login",
    element:
    <Login/>
  },



  // 后台
  {
    path:"/admin",

    element:
    <AdminLayout/>,


    children:[


      {
        path:"dashboard",
        element:
        <Dashboard/>
      },


      {
        path:"article",
        element:
        <Article/>
      },


      {
        path:"category",
        element:
        <Category/>
      },


      {
        path:"user",
        element:
        <User/>
      }


    ]

  },
  //404
  {
    path:"*",
    element:
    <div>
      404
    </div>
  }
])

export default router;