import axios, {
  type AxiosInstance,
  type AxiosRequestConfig
} from "axios"


interface RequestInstance extends AxiosInstance {

  get<T = any>(
    url:string,
    config?:AxiosRequestConfig
  ):Promise<T>


  post<T = any>(
    url:string,
    data?:any,
    config?:AxiosRequestConfig
  ):Promise<T>


  put<T = any>(
    url:string,
    data?:any,
    config?:AxiosRequestConfig
  ):Promise<T>


  delete<T = any>(
    url:string,
    config?:AxiosRequestConfig
  ):Promise<T>


  patch<T = any>(
    url:string,
    data?:any,
    config?:AxiosRequestConfig
  ):Promise<T>

}



const request = axios.create({

baseURL:"http://localhost:8000",

timeout:5000

}) as RequestInstance



// 请求拦截器
request.interceptors.request.use(

(config)=>{

const token = localStorage.getItem("token")

if(token){

config.headers.Authorization =
`Bearer ${token}`

}


return config

},

(error)=>{

return Promise.reject(error)

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