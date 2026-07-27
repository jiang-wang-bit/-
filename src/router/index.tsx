import {createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Article from "../pages/Article/index";
import Category from "../pages/Category";
import User from "../pages/User";
import Edit from "../pages/Article/Edit"
import Comment from "../pages/Comment";
import Create from "../pages/Article/Create";
import AdminLayout from "../layouts/AdminLayout";
import {Navigate} from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
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
    <AuthGuard>
      <AdminLayout/>
    </AuthGuard>,


    children:[


      {
        path:"dashboard",
        element:
        <Dashboard/>
      },


      {
        path:"article",
        children:[
          {
            index:true,
            element:<Article/>
          },
          {
            path:"create",
            element:<Create/>
          },
          {
            path:"edit/:id",
            element:<Edit/>
          }
        ]
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
      },
      {
        path:"comment",
        element:<Comment/>
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