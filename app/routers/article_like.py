from fastapi import APIRouter,Depends,HTTPException
from app.models.article_like import ArticleLike
from app.models.article import Article
from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/articles",
    tags=["文章点赞"]
)

# 点赞
@router.post("/{article_id}/like")
def like_article(article_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  # 判断是否已经点赞
  exists = db.query(ArticleLike).filter(ArticleLike.user_id==user.id,ArticleLike.article_id==article_id).first()
  if exists:
    return{
      "message":"已经点赞",
      "liked":True
    }
  like = ArticleLike(
    user_id = user.id,
    article_id = article_id
  )
  db.add(like)
  db.commit()
  count = db.query(ArticleLike).filter(ArticleLike.article_id==article_id).count()
  return{
    "liked":True,
    "count":count
  }

# 取消点赞
@router.delete("/{article_id}/like")
def unlike_article(article_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  like = db.query(ArticleLike).filter(ArticleLike.article_id==article_id,ArticleLike.user_id==user.id).first()
  if like:
    db.delete(like)
    db.commit()
  count = db.query(ArticleLike).filter(ArticleLike.article_id==article_id).count()
  return{
    "liked":False,
    "count":count
  }

# 获得点赞状态
@router.get("/{article_id}/like/status")
def get_like_status(article_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  like = db.query(ArticleLike).filter(ArticleLike.article_id==article_id,ArticleLike.user_id==user.id).first()
  count = db.query(ArticleLike).filter(ArticleLike.article_id==article_id).count()
  return{
    "liked":True if like else False,
    "count":count
  }