from pydantic import BaseModel

# 登录请求
class LoginRequest(BaseModel):
  username:str
  password:str

# 登录返回
class LoginResponse(BaseModel):
  token:str
  user:dict

