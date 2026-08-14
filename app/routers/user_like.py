from app.database import get_db
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.models.article import Article
from app.models.article_like import ArticleLike
from app.dependencies.auth import get_current_user
from app.models.user import User
router = APIRouter(
  prefix="/user",
  tags=["用户点赞"]
)

# 获取用户点赞文章
@router.get("/likes")
def get_user_likes(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  articles = db.query(Article).join(ArticleLike,ArticleLike.article_id==Article.id).filter(ArticleLike.user_id==user.id).order_by(ArticleLike.create_time.desc()).all()
  return articles