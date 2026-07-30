export function getStorage<T>(key:string):T{
   const data = localStorage.getItem(key)
  if(!data){
    return [] as T
  }
  return JSON.parse(data)
}
export function setStorage<T>(key:string,data:T){
  localStorage.setItem(key,JSON.stringify(data))
}
export function removeStorage(key:string){
  localStorage.removeItem(key)
}