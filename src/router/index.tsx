import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Article from "../pages/Article/index";
import Category from "../pages/Category";
import User from "../pages/User";
import Edit from "../pages/Article/Edit"
import Home from "../pages/Home";
import ArticleDetail from "../pages/ArticleDetail";
import Comment from "../pages/CommentAdmin";
import Create from "../pages/Article/Create";
import AdminLayout from "../layouts/AdminLayout";
import { Navigate } from "react-router-dom";
import AuthGuard from "../components/AuthGuard";
import CreateCategory from "../pages/Category/Create";
import EditCategory from "../pages/Category/Edit";
import CreateUser from "../pages/User/Create";
import EditUser from "../pages/User/Edit";
import ArticleDetailFront from "../pages/Front/ArticleDetail";
import FrontLayout from "../layouts/FrontLayout";
import ArticleList from "../pages/Front/ArticleList";
import CategoryArticle from "../pages/Front/CategoryArticle";
import Favorite from "../pages/Front/Favorite";
const router = createBrowserRouter([


  // 根路径
  {
    path: "/",
    element:
      <Navigate to="/login" />
  },



  // 登录
  {
    path: "/login",
    element:
      <Login />
  },
  // 前台
  {
    path:"/",
    element:<FrontLayout/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
      {
        path:"article",
        element:<ArticleList/>
      },
      {
        path:"article/:id",
        element:<ArticleDetailFront/>
      },
      {
        path:"category/:id",
        element:<CategoryArticle/>
      },
      {
        path:"favorite",
        element:<Favorite/>
      }
    ]
  },
  {
    path:"/article/:id",
    element:<ArticleDetail/>
  },

  // 后台
  {
    path: "/admin",

    element:
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>,


    children: [


      {
        path: "dashboard",
        element:
          <Dashboard />
      },


      {
        path: "article",
        children: [
          {
            index: true,
            element: <Article />
          },
          {
            path: "create",
            element: <Create />
          },
          {
            path: "edit/:id",
            element: <Edit />
          }
        ]
      },


      {
        path: "category",
        children:[
          {
            index:true,
            element:<Category/>
          },
          {
            path:"create",
            element:<CreateCategory/>
          },
          {
            path:"edit/:id",
            element:<EditCategory/>
          }
        ]
      },


      {
        path: "user",
        children:[
          {
            index:true,
            element:<User />
          },
          {
            path:"create",
            element:<CreateUser/>
          },
          {
            path:"edit/:id",
            element:<EditUser/>
          }
        ]
      },
      {
        path: "comment",
        element: <Comment />
      }


    ]

  },
  //404
  {
    path: "*",
    element:
      <div>
        404
      </div>
  }
])

export default router;