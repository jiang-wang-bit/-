from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.utils.jwt import decode_access_token
from app.database import get_db
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
  try:
    payload = decode_access_token(token)
    print("解析payload:",payload)
    user_id = payload.get("id")

  except Exception as e:

    print("jwt解析失败:",e)

    raise HTTPException(
      status_code=401,
      detail="token无效"
    )
  user = db.query(User).filter(User.id==user_id).first()
  if not user:

        raise HTTPException(
            status_code=404,
            detail="用户不存在"
        )
  if user.status=="disabled":
     raise HTTPException(
        status_code=403,
        detail="账号已被禁用"
     )
  if user.status == "deleted":
    raise HTTPException(
        status_code=403,
        detail="账号已被删除"
    )
  


  return user

def require_admin(user:User=Depends(get_current_user)):
   if user.role!="admin":
      raise HTTPException(
         status_code=403,
         detail="没有管理员权限"
      )