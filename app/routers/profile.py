from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.profile import UserProfileUpdate,UserProfileResponse

router = APIRouter(
  prefix="/profile",
  tags=["用户中心"]
)

# 获取个人信息
@router.get("",response_model=UserProfileResponse)
def get_profile(user_id:int,db:Session=Depends(get_db)):
  user = db.query(User).filter(User.id==user_id).first()
  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  return user

# 修改个人信息
@router.put("",response_model=UserProfileResponse)
def update_profile(user_id:int,data:UserProfileUpdate,db:Session=Depends(get_db)):
   user = db.query(User).filter(User.id==user_id).first()
   if not user:
      raise HTTPException(
        status_code=404,
        detail="用户不存在"
      )
   user.username = data.username
   user.email = data.email
   if data.avatar:
        user.avatar=data.avatar
   db.commit()
   db.refresh(user)
   return user