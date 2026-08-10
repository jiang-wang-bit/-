from pydantic import BaseModel

class CommentCreate(BaseModel):
  article_id:int
  content:str
  parent_id:int|None=None
