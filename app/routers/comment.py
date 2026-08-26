from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.comment import Comment
from app.models.article import Article
from app.models.comment_like import CommentLike
from app.models.user import User
from app.schemas.comment import CommentCreate,CommentResponse,CommentPageResponse,CommentStatusUpdate,CommentFrontResponse,BatchSchems
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from typing import Optional

router = APIRouter(
  prefix="/comments",
  tags=["评论"]
)

# 发表评论
@router.post("")
def create_comment(data:CommentCreate,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
  article = db.query(Article).filter(Article.id==data.article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  comment = Comment(
    article_id = data.article_id,
    user_id=user.id,
    content=data.content,
    parent_id=data.parent_id,
    status="pending"
  )
  db.add(comment)
  db.commit()
  db.refresh(comment)
  return comment

# 批量审核通过评论
@router.put("/batch_approve")
def batch_approve(data:BatchSchems,db:Session=Depends(get_db)):
   comments = db.query(Comment).filter(Comment.id.in_(data.ids)).all()
   for comment in comments:
      comment.status="normal"
   db.commit()
   return{
      "message":"审核通过"
   }

# 批量删除
@router.delete("/batch_delete")
def batch_approve(data:BatchSchems,db:Session=Depends(get_db)):
   comments = db.query(Comment).filter(Comment.id.in_(data.ids)).all()
   for comment in comments:
      comment.status="deleted"
   db.commit()
   return{
      "message":"审核通过"
   }

# 批量恢复
@router.put("/batch_restore")
def batch_restore(data:BatchSchems,db:Session=Depends(get_db)):
     comments = db.query(Comment).filter(Comment.id.in_(data.ids)).all()
     for comment in comments:
         comment.status="normal"
     db.commit()
     return{
        "message":"批量恢复成功"
    }

# 批量彻底删除
@router.delete("/batch_delete_permanent")
def batch_delete_permanent(
    data:BatchSchems,
    db:Session=Depends(get_db)
):

    comments = (
        db.query(Comment)
        .filter(
            Comment.id.in_(data.ids)
        )
        .all()
    )


    for comment in comments:

        # 查询子评论
        children_count = (
            db.query(Comment)
            .filter(
                Comment.parent_id == comment.id
            )
            .count()
        )


        # 没有子评论
        if children_count == 0:

            db.delete(comment)


        # 有子评论
        else:

            comment.content = "该评论已删除"

            comment.status = "removed"


    db.commit()


    return {
        "message":"批量彻底删除成功"
    }
# 获取前台评论
@router.get("/article/{article_id}",response_model=list[CommentFrontResponse])
def get_article_comment(article_id:int,db:Session=Depends(get_db)):
  comments = db.query(Comment).filter(Comment.article_id==article_id,Comment.status!="removed").order_by(Comment.create_time.desc()).all()
  return comments


# 获得全部评论
@router.get("",response_model=CommentPageResponse)
def get_comments(page:int=1,page_size:int=10,keyword:Optional[str]=None,status:Optional[str]=None,db:Session=Depends(get_db)):
    query = (
    db.query(
        Comment,
        Article.title,
        User.username
    )
    .join(
        Article,
        Comment.article_id==Article.id
    )
    .join(
        User,
        Comment.user_id==User.id
    ).filter(
        Comment.status!="deleted",
        Comment.status!="removed")
)

    # 搜索评论内容
    if keyword:
        query = query.filter(Comment.content.like(f"%{keyword}%")|Article.title.like(f"%{keyword}%")|User.username.like(f"%{keyword}%"))

    # 状态筛选
    if status:
        query = query.filter(Comment.status==status)

    # 总数量
    total = query.count()

    comments = (query.order_by(Comment.create_time.desc()).offset((page-1)*page_size).limit(page_size).all())


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
    return {

        "list":result,

        "total":total

    }

# 获取回收站评论
@router.get("/trash")
def get_delete_comments(
    page:int=1,
    page_size:int=10,
    keyword:str|None=None,
    db:Session=Depends(get_db)
):

    query = (
            db.query(
                Comment,
                Article.title,
                User.username
            )
            .join(
                Article,
                Comment.article_id==Article.id
            )
            .join(
                User,
                Comment.user_id==User.id
            )
            .filter(
                Comment.status=="deleted",
                 Comment.is_placeholder==False
            )
        )

    if keyword:
        query= query.filter( or_(
            Comment.content.like(f"%{keyword}%"),
            Article.title.like(f"%{keyword}%"),
            User.username.like(f"%{keyword}%"))
        )

    total=query.count()


     
    comments = (query.order_by(Comment.create_time.desc()).offset((page-1)*page_size).limit(page_size).all()
    )


    data=[]

    for comment,title,username in comments:

        data.append({

          "id":comment.id,

          "article_title":title,

          "username":username,

          "content":comment.content,

          "status":comment.status,

          "create_time":comment.create_time

        })


    return {
        "list":data,
        "total":total
    }
  

# 恢复评论
@router.put("/{id}/restore")
def restore_comment(id:int,db:Session=Depends(get_db)):
   comment = db.query(Comment).filter(Comment.id==id).first()
   if not Comment:
      raise HTTPException(
         status_code=404,
         detail="评论不存在"
      )
   comment.status="normal"
   db.commit()
   return{
      "message":"恢复成功"
   }

# 彻底删除
@router.delete("/{id}/permanent")
def permanent_delete(
    id:int,
    db:Session=Depends(get_db)
):

    comment = db.query(Comment)\
        .filter(Comment.id == id)\
        .first()


    if not comment:
        raise HTTPException(
            status_code=404,
            detail="评论不存在"
        )


    # 查询子评论
    children_count = (
        db.query(Comment)
        .filter(
            Comment.parent_id == id
        )
        .count()
    )


    # 没有子评论，真正删除
    if children_count == 0:

        db.delete(comment)


    # 有子评论，保留占位
    else:

        comment.content = "该评论已删除"

        comment.status = "removed"


    db.commit()


    return {
        "message":"彻底删除成功"
    }

# 删除评论
@router.delete("/{id}")
def delete_comment(id:int,db:Session=Depends(get_db)):
  comment = db.query(Comment).filter(Comment.id==id).first()
  if not comment:
    raise HTTPException(
      status_code=404,
      detail="评论不存在"
    )
#   查询有没有子评论
  children_count = db.query(Comment)\
    .filter(
        Comment.parent_id == id
    )\
    .count()
  comment.status="deleted"

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