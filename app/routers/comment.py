from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.article import Article
from app.schemas.comment import CommentCreate
from app.database import get_db

router = APIRouter(
  prefix="/comments",
  tags=["评论"]
)

# 发表评论
@router.post("")
def create_comment(data:CommentCreate,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==data.article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  comment = Comment(
    article_id = data.article_id,
    user_id=2,
    content=data.content,
    parent_id=data.parent_id
  )
  db.add(comment)
  db.commit()
  db.refresh(comment)
  return comment

# 获取评论
@router.get("/article/{article_id}")
def get_article_comment(article_id:int,db:Session=Depends(get_db)):
  comments = db.query(Comment).filter(Comment.article_id==article_id,Comment.status=="normal").order_by(Comment.create_time.desc()).all()
  return comments