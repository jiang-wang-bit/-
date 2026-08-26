import { useState } from "react"


export default function useTableQuery(){

    // 当前页
    const [page,setPage]=useState(1)


    // 每页数量
    const [pageSize,setPageSize]=useState(10)


    // 输入框内容
    const [keyword,setKeyword]=useState("")


    // 真正发送给后端的关键词
    const [searchKeyword,setSearchKeyword]=useState("")


    // loading
    const [loading,setLoading]=useState(false)
    

    const [total,setTotal]=useState(0)


    // 点击查询
    const handleSearch=()=>{

        setSearchKeyword(keyword)

        setPage(1)

    }



    // 重置
    const handleReset=()=>{

        setKeyword("")

        setSearchKeyword("")

        setPage(1)

    }



    // 分页改变

    const handlePageChange=(
        current:number,
        size:number
    )=>{

        setPage(current)

        setPageSize(size)

    }


    return {

        page,

        pageSize,


        total,

        keyword,

        searchKeyword,


        loading,


        setKeyword,

        setLoading,

        setTotal,



        handleSearch,

        handleReset,

        handlePageChange,


        setPage,

        setPageSize

    }

}