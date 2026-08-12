from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.article import Article
from app.models.favorites import ArticleFavorite
router = APIRouter(
  prefix="/articles",
  tags=["文章收藏"]
)

# 收藏
@router.post("/{article_id}/favorite")
def favorite_article(article_id:int,user_id:int,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  exists = db.query(ArticleFavorite).filter(ArticleFavorite.article_id==article_id,ArticleFavorite.user_id==user_id).first()
  if exists:
    return{
      "favorited":True
    }
  favorite = ArticleFavorite(
    user_id=user_id,
    article_id=article_id
  )
  db.add(favorite)
  db.commit()
  return{
    "favorited":True
  }

# 取消收藏
@router.delete("/{article_id}/favorite")
def unfavorite_article(article_id:int,user_id:int,db:Session=Depends(get_db)):
  favorite = db.query(ArticleFavorite).filter(ArticleFavorite.user_id==user_id,ArticleFavorite.article_id==article_id).first()
  if favorite:
    db.delete(favorite)
    db.commit()
  return{
    "favorited":False
  }

# 查询收藏状态
@router.get("/{article_id}/favorite/status")
def favorite_status(article_id:int,user_id:int,db:Session=Depends(get_db)):
  favorite = db.query(ArticleFavorite).filter(ArticleFavorite.user_id==user_id,ArticleFavorite.article_id==article_id).first()
  return{
    "favorited":True if favorite else False
  }

