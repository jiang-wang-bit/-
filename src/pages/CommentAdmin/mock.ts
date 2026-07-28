import { CommentType } from "./types"
// 模拟数据
export const data:CommentType[]=[

{
id:1,
articleId:100,
articleTitle:"React Hooks详解",
username:"张三",
content:"useEffect怎么理解？",
status:"待审核",
time:"2026-07-27",
parentId:null,
like:0,
liked:true
},


{
id:2,
articleId:100,
articleTitle:"React Hooks详解",
username:"admin",
content:"可以理解为生命周期管理",
status:"通过",
time:"2026-07-27",
parentId:1,
like:0,
liked:true
},


{
id:3,
articleId:101,
articleTitle:"Vue基础",
username:"李四",
content:"Vue3很好用",
status:"通过",
time:"2026-07-27",
parentId:null,
like:0,
liked:true
}

]