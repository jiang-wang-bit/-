from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.user import User
from app.schemas.user import (UserCreate,UserResponse,UserUpdate,UserListResponse,batchUserSchema)
from app.utils.password import hash_password
from typing import Optional
router = APIRouter(
  prefix="/users",
  tags=["用户管理"]
)

# 回收站列表
@router.get("/trash",response_model=UserListResponse)
def get_deleted_users(page:int=1,page_size:int=10,keyword:Optional[str]=None,db:Session=Depends(get_db)):

  query = db.query(User).filter(User.status=="deleted")
  if keyword:
     query = query.filter(or_(
                  User.username.like(
                    f"%{keyword}%"
                ),

                User.email.like(
                    f"%{keyword}%"
                )))
  total = query.count()

  users = query.order_by(User.id.asc()).offset((page-1)*page_size).limit(page_size).all()


  return{
    "list":users,
    "total":total
  }

# 批量禁用用户
@router.put("/batch_disable")
def batch_disable(data:batchUserSchema,db:Session=Depends(get_db)):
   users = (db.query(User).filter(User.id.in_(data.ids)).all())
   for user in users:
      user.before_status=user.status
      user.status = "disabled"
   db.commit()
   return{
      "message":"批量禁用成功"
   }

# 批量启用
@router.put("/batch_enable")
def batch_disable(data:batchUserSchema,db:Session=Depends(get_db)):
   users = (db.query(User).filter(User.id.in_(data.ids)).all())
   for user in users:
      user.status = "active"
   db.commit()
   return{
      "message":"批量启用成功"
   }


# 批量删除用户
@router.put("/batch_deleted")
def batch_deleted(data:batchUserSchema,db:Session=Depends(get_db)):
   users = db.query(User).filter(User.id.in_(data.ids)).all()
   for user in users:

        user.before_status=user.status

        user.status="deleted"
   db.commit()

# 批量恢复
@router.put("/batch_restore")
def batch_deleted(data:batchUserSchema,db:Session=Depends(get_db)):
   users = db.query(User).filter(User.id.in_(data.ids)).all()
   for user in users:
      user.status=user.before_status or "active"
   db.commit()
   return{
      "message":"批量恢复成功"
   }

# 批量彻底删除
@router.delete("/batch_permannet")
def batch_deleted(data:batchUserSchema,db:Session=Depends(get_db)):
   users = db.query(User).filter(User.id.in_(data.ids)).all()
   for user in users:
      db.delete(user)
   db.commit()
   return{
      "message":"批量彻底删除成功"
   }


# 获取用户列表
@router.get("",response_model=UserListResponse)
def get_users(page:int=Query(1),pageSize:int=Query(10), username:str|None=None,
    email:str|None=None,
    role:str|None=None,db:Session = Depends(get_db)):
  query = db.query(User).filter(User.status!="deleted")


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
    user.password=hash_password(data.password)
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
  user.before_status = user.status
  user.status = "deleted"
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
  user.status =user.before_status
  user.before_status=None
  db.commit()
  db.refresh(user)
  return{
    "message":"恢复成功"
  }

# 彻底删除用户
@router.delete("/{id}/permanent")
def delete_user_permanently(id:int,db:Session=Depends(get_db)):
   user = db.query(User).filter(User.id==id).first()
   if not user:
       raise HTTPException(
          status_code=404,
          detail="用户不存在"
       )
   db.delete(user)
   db.commit()
   return{
    "message":"用户已经彻底删除"
   }

# 禁用用户
@router.put("/{id}/disable")
def disable_user(id:int,db:Session=Depends(get_db)):
   user = db.query(User).filter(User.id==id).first()
   if not user:
      raise HTTPException(
         status_code=404,
         detail="用户不存在"
      )
   user.before_status=user.status
   user.status = "disabled"
   db.commit()
   return{
      "message":"用户已禁用"
   }



# 启用用户
@router.put("/{id}/enable")
def enable_user(id:int,db:Session=Depends(get_db)):
    user = db.query(User).filter(User.id==id).first()
    if not user:
        raise HTTPException(
          status_code=404,
          detail="用户不存在"
        )
    user.status="active"
    db.commit()
    return{
       "message":"用户已启用"
    }


# 重置密码
@router.put("/{id}/reset_password")
def reset_password(id:int,db:Session=Depends(get_db)):
    user = db.query(User).filter(User.id==id).first()
    if not user:
          raise HTTPException(
            status_code=404,
            detail="用户不存在"
          )
    new_password = "123456"
    user.password=hash_password(new_password)
    db.commit()
    return{
        "message":"密码已重置",
        "password":new_password
    }