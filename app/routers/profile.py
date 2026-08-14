from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.profile import UserProfileUpdate,UserProfileResponse
from app.dependencies.auth import get_current_user
from app.schemas.profile import PasswordUpdate
from app.utils.password import pwd_context
router = APIRouter(
  prefix="/profile",
  tags=["用户中心"]
)

# 获取个人信息
@router.get("",response_model=UserProfileResponse)
def get_profile(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  user = db.query(User).filter(User.id==user.id).first()
  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  return user

# 修改个人信息
@router.put("",response_model=UserProfileResponse)
def update_profile(data:UserProfileUpdate,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
   user = db.query(User).filter(User.id==current_user.id).first()
   if not user:
      raise HTTPException(
        status_code=404,
        detail="用户不存在"
      )

   
   exists=db.query(User).filter(
    User.username==data.username,
    User.id!=current_user.id).first()

   if exists:
      raise HTTPException(
          400,
          "用户名已存在"
      )
   user.username = data.username
   user.email = data.email
   if data.avatar:
        user.avatar=data.avatar
   db.commit()
   db.refresh(user)
   return user

# 修改密码
@router.put("/password")
def update_password(data:PasswordUpdate,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
   user = db.query(User).filter(User.id==current_user.id).first()
   if not user:
      raise HTTPException(
         status_code=404,
         detail="用户不存在"
      )
   if not pwd_context.verify(data.old_password,user.password):
      raise HTTPException(
         status_code=400,
         detail="旧密码错误"
      )
  #  新密码加密
   user.password = pwd_context.hash(data.new_password)
   db.commit()
   return{
      "message":"密码修改成功"
   }