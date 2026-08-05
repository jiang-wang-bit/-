export interface ArticleType {

 id:number;

 title:string;

 desc:string;

 content:string;

 author:string;

 cover:string

 categoryId:number;

 views:number;

 status:"published"|"draft";

 createTime:string;

updateTime:string;

}