from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.article import Article
from app.schemas.comment import CommentCreate
from app.database import get_db

router = APIRouter(
  prefix="/comments",
  tags=["评论"]
)

# 发表评论
@router.post("")
def create_comment(data:CommentCreate,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==data.article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  comment = Comment(
    article_id = data.article_id,
    user_id=2,
    content=data.content,
    parent_id=data.parent_id
  )
  db.add(comment)
  db.commit()
  db.refresh(comment)
  return comment

# 获取评论
@router.get("/article/{article_id}")
def get_article_comment(article_id:int,db:Session=Depends(get_db)):
  comments = db.query(Comment).filter(Comment.article_id==article_id,Comment.status=="normal").order_by(Comment.create_time.desc()).all()
  return comments

# 删除评论
@router.delete("/comments/{id}")
def delete_comment(id:int,db:Session=Depends(get_db)):
  comment = db.query(Comment).filter(Comment.id==id).first()
  if not comment:
    raise HTTPException(
      status_code=404,
      detail="评论不存在"
    )
  db.delete(comment)
  db.commit()
  return{
    "message":"删除成功"
  }

# 评论状态修改
@router.patch("/comments/{id}/status")
def update_comment_status(id:int,status:str,db:Session=Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id==id).first()
    comment.status = status
    db.commit()
    return comment

# 评论点赞
@router.post("/comments/{id}/like")
def like_comment(id:int,db:Session=Depends(get_db)):
   comment = db.query(Comment).filter(Comment.id==id).first()
   comment.likes +=1
   db.commit()
   return{
     "likes":comment.likes
   }

# 取消点赞
@router.delete("/comment/{id}/like")
def unlike_comment(id:int,db:Session=Depends(get_db)):
   comment = db.query(Comment).filter(Comment.id==id).first()
   if comment.likes>0:
      comment.likes -=1
   db.commit()
   return{
      "likes":comment.likes
   }
   