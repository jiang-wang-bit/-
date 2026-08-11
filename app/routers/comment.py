from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.article import Article
from app.models.comment_like import CommentLike
from app.models.user import User
from app.schemas.comment import CommentCreate,CommentResponse,CommentStatusUpdate,CommentFrontResponse
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
    parent_id=data.parent_id,
    status="pending"
  )
  db.add(comment)
  db.commit()
  db.refresh(comment)
  return comment

# 获取前台评论
@router.get("/article/{article_id}",response_model=list[CommentFrontResponse])
def get_article_comment(article_id:int,db:Session=Depends(get_db)):
  comments = db.query(Comment).filter(Comment.article_id==article_id,Comment.status=="normal").order_by(Comment.create_time.desc()).all()
  return comments


# 获得全部评论
@router.get("",response_model=list[CommentResponse])
def get_comments(db:Session=Depends(get_db)):
   
    comments= (db.query(Comment,Article.title,User.username).join(Article,Comment.article_id==Article.id).join(User,Comment.user_id==User.id).order_by(Comment.create_time.desc()).all())
    result = []
    for comment,title,username in comments:
        result.append({

            "id":comment.id,

            "article_id":comment.article_id,

            "user_id":comment.user_id,

            "content":comment.content,

            "status":comment.status,

            "likes":comment.likes,

            "parent_id":comment.parent_id,

            "create_time":comment.create_time,

            "article_title":title,

            "username":username

        })
    return result
   

# 删除评论
@router.delete("/{id}")
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
@router.patch("/{id}/status")
def update_comment_status(id:int,data:CommentStatusUpdate,db:Session=Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id==id).first()
    if not comment:
        raise HTTPException(
            status_code=404,
            detail="评论不存在"
        )
    comment.status = data.status
    db.commit()
    db.refresh(comment)
    return comment

# 评论点赞
@router.post("/{id}/like")
def like_comment(
    id:int,
    user_id:int,
    db:Session=Depends(get_db)
):


    exists=db.query(CommentLike)\
    .filter(
        CommentLike.comment_id==id,
        CommentLike.user_id==user_id
    ).first()


    if exists:
        return {
            "message":"已经点赞"
        }



    like=CommentLike(
        comment_id=id,
        user_id=user_id
    )


    db.add(like)


    comment=db.query(Comment)\
    .filter(Comment.id==id)\
    .first()
    comment.likes+=1

    db.commit()

    return {
        "likes":comment.likes,
        "liked":True
    }

# 取消点赞
@router.delete("/{id}/like")
def unlike_comment(
    id:int,
    user_id:int,
    db:Session=Depends(get_db)
):

    like=db.query(CommentLike)\
    .filter(
        CommentLike.comment_id==id,
        CommentLike.user_id==user_id
    ).first()

    if like:

        db.delete(like)
        comment=db.query(Comment)\
        .filter(Comment.id==id)\
        .first()

        if comment.likes>0:
            comment.likes-=1

        db.commit()


    return {
        "likes":comment.likes,
        "liked":False
    }

# 查询点赞状态接口
@router.get("/{id}/like-status")
def get_comment_like_status(id:int,user_id:int,db:Session=Depends(get_db)):
   like = db.query(CommentLike).filter(CommentLike.comment_id==id,CommentLike.user_id==user_id).first()
   comment = db.query(Comment).filter(Comment.id==id).first()
   return{
      "liked":like is not None,
      "likes":comment.likes
   }