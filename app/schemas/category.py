from datetime import datetime
from pydantic import BaseModel, ConfigDict

# 创建分类
class CategoryCreate(BaseModel):
  name:str
  description:str|None=None


# 修改分类
class CategoryUpdate(BaseModel):
  name:str
  description:str|None=None

# 返回分类
class CategoryResponse(BaseModel):
  id: int

  name: str

  description: str | None

  create_time: datetime

  status:str


  article_count:int=0


  model_config = ConfigDict(
      from_attributes=True
  )

class CategoryListResponse(BaseModel):

    list:list[CategoryResponse]

    total:int