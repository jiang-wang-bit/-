export interface Article{

 id:number;

 title:string;

 desc:string;

 author:string;

 createTime:string;

 category:string;

 views:number;

 content:string;

}

export const articles:Article[]=[

{
 id:1,
 title:"React Hooks详解",
 desc:"深入理解useState和useEffect",
 author:"admin",
 createTime:"2026-07-31",
 category:"React",
 views:1000,
 content:"React Hooks详细介绍"
},


{
 id:2,
 title:"TypeScript入门",
 desc:"从JavaScript到TypeScript",
 author:"admin",
 createTime:"2026-07-30",
 category:"TypeScript",
 views:800,
 content:"TypeScript介绍"
},

{
 id:3,
 title:"React18源码分析",
 desc:"深入理解React架构",
 author:"admin",
 createTime:"2026-07-29",
 category:"React",
 views:9999,
 content:"React源码分析"
},


{
 id:4,
 title:"Webpack原理",
 desc:"模块打包机制解析",
 author:"admin",
 createTime:"2026-07-28",
 category:"React",
 views:999,
 content:"Webpack原理解析"
}

]