from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest,LoginResponse,UserCreate
from app.utils.jwt import create_access_token
from passlib.context import CryptContext

router = APIRouter(
  prefix="/auth",
  tags=["认证"]
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
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

  if not pwd_context.verify(
    data.password,
    user.password
):
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

# 用户注册
@router.post("/register")
def register(data:UserCreate,db:Session=Depends(get_db)):
  exists = (db.query(User).filter(User.username==data.username).first())
  if exists:
    raise HTTPException(
      status_code=400,
      detail="用户名已经存在"
    )
 

  # 密码加密
  password_hash = (
    pwd_context.hash(data.password)
  )

  user = User(
    username=data.username,
    password=password_hash,
    email=data.email,
    role="user",
    avatar=""
  )


  db.add(user)
  db.commit()
  db.refresh(user)
  return{
    "message":"注册成功"
  }