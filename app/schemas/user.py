from pydantic import BaseModel
from datetime import datetime

# 创建用户请求
class UserCreate(BaseModel):
  username:str
  email:str
  password:str|None=None
  role:str = "user"
  status:str = "active"

# 修改用户请求
class UserUpdate(BaseModel):
  username:str
  email:str
  role:str
  status:str
  password:str

# 返回用户数据
class UserResponse(BaseModel):
  id:int
  username:str
  email:str
  role:str
  status:str
  create_time:datetime
  class Config:
    from_attributes = True


class UserListResponse(BaseModel):

    list:list[UserResponse]

    total:int