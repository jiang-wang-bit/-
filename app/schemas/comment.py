from pydantic import BaseModel
from datetime import datetime
class CommentCreate(BaseModel):
  article_id:int
  content:str
  parent_id:int|None=None

class CommentStatusUpdate(BaseModel):

    status:str

class CommentFrontResponse(BaseModel):

    id:int

    content:str

    user_id:int

    article_id:int

    parent_id:int | None=None

    create_time:datetime

    status:str

    likes:int


    class Config:
        from_attributes=True

class CommentResponse(BaseModel):

    id:int

    article_id:int

    user_id:int

    content:str

    parent_id:int|None=None

    status:str

    likes:int

    create_time:datetime

    article_title:str|None=None

    username:str|None=None


    class Config:
        from_attributes=True