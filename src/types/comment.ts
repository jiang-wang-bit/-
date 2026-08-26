export interface CommentType{
  id:number;
  articleId:number;
  articleTitle?:string;
  userId:number
  username?:string;
  content:string;
  status:string;
  time:string;
  parentId:number|null;
  like:number;
  liked?:boolean;
  parentName?:string
}

// 后端返回的数据
export interface BackendCommentType {
  id: number
  article_id: number
  user_id: number
  article_title:string
  content: string
  parent_id: number | null
  status: string
  create_time: string
}

export interface CommentPage{

 list:BackendCommentType[]

 total:number

}
