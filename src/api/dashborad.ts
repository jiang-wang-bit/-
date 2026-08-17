import request from "../request";

export function getDashborad(){
  return request.get("/admin/dashborad")
}
