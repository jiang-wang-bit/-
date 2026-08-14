from jose import jwt
from datetime import datetime,timedelta

# 密钥
SECRET_KEY = "blog-secret-key"

# 指定加密算法：HS256 对称加密（同一密钥加密、解密）
ALGORITHM = "HS256"

# 创建token
def create_access_token(data:dict):
  to_encode = data.copy()

  expire = datetime.utcnow() + timedelta(hours=24)

  to_encode.update({
    "exp":expire
  })

  token = jwt.encode(
    to_encode,
    SECRET_KEY,
    algorithm=ALGORITHM
  )
  return token


# 解析token
def decode_access_token(token:str):
  payload = jwt.decode(
    token,
    SECRET_KEY,
    algorithms=[ALGORITHM]
  )
  return payload