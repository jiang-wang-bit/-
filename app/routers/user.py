from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import (UserCreate,UserResponse,UserUpdate,UserListResponse)

router = APIRouter(
  prefix="/users",
  tags=["用户管理"]
)

# 回收站列表
@router.get("/trash",response_model=UserListResponse)
def get_deleted_users(db:Session=Depends(get_db)):
  users = db.query(User).filter(User.status=="disabled").order_by(User.id.asc()).all()
  return{
    "list":users,
    "total":len(users)
  }

# 获取用户列表
@router.get("",response_model=UserListResponse)
def get_users(page:int=Query(1),pageSize:int=Query(10), username:str|None=None,
    email:str|None=None,
    role:str|None=None,db:Session = Depends(get_db)):
  query = db.query(User).filter(User.status=="active")


    # 用户名搜索
  if username:

        query=query.filter(
            User.username.like(
                f"%{username}%"
            )
        )


    # 邮箱搜索
  if email:

      query=query.filter(
          User.email.like(
              f"%{email}%"
          )
      )


  # 角色搜索
  if role:

      query=query.filter(
          User.role==role
      )


  query=query.order_by(
      User.id.asc()
  )



  total = query.count()

  users = query.offset(
      (page-1)*pageSize
  ).limit(pageSize).all()


  return {
      "list":users,
      "total":total
  }

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
  if data.password:
    user.password=data.password
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
 
  user.status = "disabled"
  db.commit()
  return{
    "message":"删除成功"
  }


# 恢复用户
@router.put("/{id}/restore")
def restore_user(id:int,db:Session=Depends(get_db)):
  user = db.query(User).filter(User.id==id).first()
  if not user:
    raise HTTPException(
      status_code=404,
      detail="用户不存在"
    )
  user.status ="active"
  db.commit()
  db.refresh(user)
  return{
    "message":"恢复成功"
  }