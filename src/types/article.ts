export interface ArticleType {

 id:number;

 title:string;

 desc?:string;

 content:string;

 author:string;

 cover:string

 categoryId:number;

 views:number;

 status:"published"|"draft"|"offline"|"trash";


 beforeDeleteStatus?:
  Exclude<ArticleType["status"],"trash">;

 createTime:string;

updateTime:string;

}

export interface ArticlePageResponse {

    list: ArticleType[]

    total:number

}