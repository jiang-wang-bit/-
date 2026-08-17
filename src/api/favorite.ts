import request from "../request"


export function getFavoriteList(
){

 return request.get(
 "/favorites"
 )

}