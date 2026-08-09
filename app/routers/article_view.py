from fastapi import APIRouter,Depends,Request
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
def increase_view(article_id:int,request:Request,db:Session=Depends(get_db)):
   article = db.query(Article).filter(Article.id==article_id).first()
   if not article:
     return{
        "message":"文章不存在"
     }
   ip =request.client.host

   view = ArticleView(
      article_id=article_id,
      ip=ip
   )
   last_view = db.query(ArticleView).filter(ArticleView.ip==ip,ArticleView.article_id==article_id).order_by(ArticleView.create_time.desc()).first()
   if last_view:
      if datetime.now() - last_view.create_time < timedelta(minutes=5):
         return{
            "message":"重复访问"
         }
      
   db.add(view)
   db.commit()
   return{
      "views":article.views
   }
