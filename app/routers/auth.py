from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest,LoginResponse
from app.utils.jwt import create_access_token

router = APIRouter(
  prefix="/auth",
  tags=["认证"]
)

@router.post("/login",response_model=LoginResponse)
def login(data:LoginRequest,db:Session=Depends(get_db)):
  user = db.query(User).filter(User.username==data.username
  ).first()

  if not user:
    raise HTTPException(
    status_code=404,
    detail="用户不存在"
  )

  if user.password!=data.password:
    raise HTTPException(
      status_code=401,
      detail="密码错误"
    )

  # 创建token
  token = create_access_token(
    {
      "id":user.id,
      "username":user.username,
      "role":user.role
    }
  )

  return{
    "token":token,
    "user":{
      "id":user.id,
      "username":user.username,
      "email":user.email,
      "role":user.role,
      "avatar":user.avatar or ""
}
  }