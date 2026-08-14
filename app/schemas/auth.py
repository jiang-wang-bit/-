from pydantic import BaseModel

# 登录请求
class LoginRequest(BaseModel):
  username:str
  password:str

# 登录返回
class LoginResponse(BaseModel):
  token:str
  user:dict

# 用户注册
class UserCreate(BaseModel):
  username:str
  password:str
  email:str
