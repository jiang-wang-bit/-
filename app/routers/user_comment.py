from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.comment import Comment
from app.models.article import Article
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.comment import MyCommentResponse
router = APIRouter(
    prefix="/user/comments",
    tags=["用户评论"]
)

@router.get("",response_model=list[MyCommentResponse])
def get_user_comments(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
  result = []
  comments = db.query(Comment).join(Article,Comment.article_id==Article.id).filter(Comment.user_id==user.id).order_by(Comment.create_time.desc()).all()
  for item in comments:

        result.append({

            "id":item.id,

            "content":item.content,

            "articleId":item.article_id,

            "articleTitle":item.article.title,

            "status":item.status,

            "time":item.create_time

        })

  return result

