from fastapi import APIRouter,Depends,Request,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.article_view import ArticleView
from app.models.article import Article
from datetime import timedelta
from datetime import datetime

router = APIRouter(
    prefix="/articles",
    tags=["文章阅读量"]
)

# 增加阅读量
@router.post("/{article_id}/view")
def increase_view(article_id:int,user_id:int,request:Request,db:Session=Depends(get_db)):
    article = db.query(Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="文章不存在")
    
    ip = request.client.host
    time_limit = datetime.now() - timedelta(minutes=5)
    exits = db.query(ArticleView).filter(ArticleView.article_id==article_id,ArticleView.ip ==ip,ArticleView.create_time>=time_limit).first()
    if exits:
        article = db.query(Article).filter(Article.id ==article_id).first()
        return{
          "views":article.views,
          "message":"重复访问"
        }

    view = ArticleView(
        article_id=article_id,
        user_id=user_id,
        ip=ip)
    db.add(view)
    article=db.query(Article).filter(Article.id==article_id).first()
    article.views+=1
    db.commit()
    db.refresh(article)
    return{
        "views":article.views
    }