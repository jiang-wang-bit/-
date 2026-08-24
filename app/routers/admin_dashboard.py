from app.database import get_db
from app.dependencies.auth import require_admin
from fastapi import APIRouter,Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.article import Article
from app.models.comment import Comment
from app.models.category import Category

router = APIRouter(
  prefix="/admin",
  tags=["后台首页"]
)

@router.get("/dashborad")
def get_dashborad(db:Session=Depends(get_db),admin=Depends(require_admin)):
  user_count = db.query(User).count()

  article_count = db.query(Article).count()

  category_count = db.query(Category).filter(Category.status=="active").count()

  publish_article_count = db.query(Article).filter(Article.status=="published").count()

  draft_article_count = db.query(Article).filter(Article.status=="draft").count()

  # 文章发布趋势

  publish_trend = (
    db.query(func.date(Article.create_time).label("date"),
             func.count(Article.id).label("count")).filter(
               Article.status=="published"
             ).group_by(
               func.date(Article.create_time)
             ).order_by(
               func.date(Article.create_time)
             ).all()
  )

  # 最近发布文章
  recent_articles = (
    db.query(Article).filter(Article.status=="published").order_by(Article.create_time.desc()).limit(5).all()
  )

  # 分类文章数量
  category_trend = (
    db.query(Category.name,func.count(Article.id)).outerjoin(
      Article,
        (Category.id == Article.category_id)
        &
        (Article.status=="published")
    ).group_by(
      Category.name
    ).all()
  )

  return{
    "userCount":user_count,
    "articleCount" :article_count,
    "categoryCount":category_count,
    "publishArticleCount":publish_article_count,
    "draftArticleCount":draft_article_count,
    # 折线图
      "publishTrend":[
          {
              "date":str(item.date),
              "count":item.count
          }
          for item in publish_trend
      ],
      # 最近文章
      "recentArticles":[
          {
              "id":article.id,
              "title":article.title,
              "author":article.author,
              "createTime":article.create_time
          }
          for article in recent_articles
      ],
      # 饼图
      "categoryTrend":[
          {
              "name":item[0],
              "value":item[1]
          }
          for item in category_trend
      ]
  }