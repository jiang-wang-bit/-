export interface CategoryType {

 id:number;

 name:string;

 createTime:string;

 status:string;

 article_count:number;

}

export interface CategoryListResponse{
  list:CategoryType[]
  total:number
}