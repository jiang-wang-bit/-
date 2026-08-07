import axios from "axios";
const request = axios.create({
  baseURL:"http://localhost:8000",
  timeout:5000
})

// 请求拦截器
request.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem("token")
    if(token)
    {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }
)

// 响应拦截器
request.interceptors.response.use(
  (res)=>{
    return res.data
  },
  (error)=>{
    console.log(error)
    return Promise.reject(error)
  }
)
export default request