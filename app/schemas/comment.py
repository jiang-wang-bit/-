from pydantic import BaseModel
from datetime import datetime
class CommentCreate(BaseModel):
  article_id:int
  content:str
  parent_id:int|None=None


class CommentResponse(BaseModel):

    id:int

    article_id:int

    user_id:int

    content:str

    parent_id:int|None

    status:str

    likes:int

    create_time:datetime


    class Config:
        from_attributes=True