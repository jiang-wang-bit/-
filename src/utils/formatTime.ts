export function formatCommentTime(time:string){

  const date = new Date(time)
  const now = new Date()
  const diff =
    now.getTime()-date.getTime()
  const seconds =
    Math.floor(diff/1000)
  // 刚刚
  if(seconds < 60){
    return "刚刚"
  }
  const minutes =
    Math.floor(seconds/60)
  // 分钟
  if(minutes < 60){
    return `${minutes}分钟前`
  }
  const hours =
    Math.floor(minutes/60)
  // 小时
  if(hours < 24){
    return `${hours}小时前`
  }
  const days =
    Math.floor(hours/24)
  // 昨天
  if(days===1){

    return `昨天 ${date.getHours()}:${String(date.getMinutes()).padStart(2,"0")}`

  }
  // 超过7天
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

}