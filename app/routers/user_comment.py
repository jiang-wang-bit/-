from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.comment import Comment
from app.models.article import Article
router = APIRouter(
    prefix="/user/comments",
    tags=["用户评论"]
)

@router.get("")
def get_user_comments(user_id:int,db:Session=Depends(get_db)):
  comments = db.query(Comment).join(Article,Comment.article_id==Article.id).filter(Comment.user_id==user_id).order_by(Comment.create_time.desc()).all()
  return comments

