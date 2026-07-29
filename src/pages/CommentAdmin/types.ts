export interface CommentType{
  id:number;
  articleId:number;
  articleTitle:string;
  username:string;
  content:string;
  status:string;
  time:string;
  parentId:number|null;
  like:number;
  liked:boolean;
  parentName:string
}