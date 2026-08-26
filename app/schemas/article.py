from pydantic import BaseModel
from datetime import datetime

class ArticleCreate(BaseModel):
  title:str
  content:str
  cover:str|None=None
  category_id:int
  status:str="draft"

class ArticleUpdate(BaseModel):
  title:str
  content:str
  cover:str|None=None
  category_id:int
  status:str

# 文章状态:
class ArticleStatus(BaseModel):
   status:str

# 批量删除:
class BatchDelete(BaseModel):
    ids:list[int]

class ArticleResponse(BaseModel):
    id:int

    title:str

    content:str

    cover:str | None

    author:str

    category_id:int

    category_name:str|None=None

    status:str

    views:int

    likes:int

    create_time:datetime

    class config:
       from_attributes = True

class ArticlePageResponse(BaseModel):
   list:list[ArticleResponse]

   total:int