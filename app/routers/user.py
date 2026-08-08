from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import (UserCreate,UserResponse,UserUpdate)

router = APIRouter(
  prefix="/users",
  tags=["用户管理"]
)

# 数据库连接
def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

# 获取用户列表
@router.get("",response_model=list[UserResponse])
def get_users(db:Session = Depends(get_db)):
  users = db.query(User).all()
  return users

# 添加用户
@router.post("",response_model=UserResponse)
def create_user(data:UserCreate,db:Session=Depends(get_db)):
  user = User(
    username=data.username,
    email=data.email,
    password=data.password,
    role=data.role,
    status=data.status
  )
  db.add(user)
  db.commit()
  db.refresh(user)
  return user

# 获取用户详情
@router.get("/{id}",response_model=UserResponse)
def get_user_detail(id:int,db:Session=Depends(get_db)):
  user = db.query(User).filter(
    User.id == id
  ).first()

  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  return user

# 修改用户
@router.put("/{id}",response_model=UserResponse)
def update_user(
  id:int,data:UserUpdate,db:Session=Depends(get_db)):
  user = db.query(User).filter(User.id==id).first()
  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  user.username = data.username
  user.email = data.email
  user.status = data.status
  user.role = data.role
  db.commit()
  db.refresh(user)
  return user

# 删除用户
@router.delete("/{id}")
def delete_user(id:int,db:Session=Depends(get_db)):
  user = db.query(User).filter(User.id==id).first()
  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  db.delete(user)
  db.commit()
  return{
    "message":"删除成功"
  }