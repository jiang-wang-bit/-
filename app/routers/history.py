from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.article import Article
from app.models.article_history import ArticleHistory
from datetime import datetime
from app.dependencies.auth import get_current_user
from app.models.user import User
router = APIRouter(
  prefix="/user",
  tags=["阅读历史"]
)

# 添加阅读记录
@router.post("/history")
def add_history(
    article_id:int,
    user:User=Depends(get_current_user),
    db:Session=Depends(get_db)
):

    article = db.query(Article).filter(
        Article.id==article_id
    ).first()


    if not article:
        raise HTTPException(
            status_code=404,
            detail="文章不存在"
        )


    exists = db.query(ArticleHistory).filter(
        ArticleHistory.user_id==user.id,
        ArticleHistory.article_id==article_id
    ).first()


    if exists:

        exists.create_time=datetime.now()

    else:

        history = ArticleHistory(
            user_id=user.id,
            article_id=article_id
        )

        db.add(history)


    db.commit()


    return {
        "message":"记录成功"
    }
    
# 获取阅读历史
@router.get("/history")
def get_history(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  articles = db.query(Article).join(ArticleHistory,ArticleHistory.article_id==Article.id).filter(ArticleHistory.user_id==user.id).order_by(ArticleHistory.create_time.desc()).all()
  return articles