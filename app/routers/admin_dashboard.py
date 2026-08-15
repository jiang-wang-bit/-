from app.database import get_db
from app.dependencies.auth import require_admin
from fastapi import APIRouter,Depends
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

  category_count = db.query(Category).count()

  return{
    "userCount":user_count,
    "articleCount" :article_count,
    "categoryCount":category_count
  }