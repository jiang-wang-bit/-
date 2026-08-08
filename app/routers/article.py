from fastapi import APIRouter,Depends,HTTPException
from app.schemas.article import (ArticleCreate,ArticleResponse,ArticleUpdate,ArticleStatus,BatchDelete)
from app.models.article import Article
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(
  prefix="/articles",
  tags=["文章"]
)

# 获得文章
@router.get("",response_model=list[ArticleResponse])
def get_articles(db:Session=Depends(get_db)):
  articles = db.query(Article).all()
  return articles

# 新增文章
@router.post("",response_model=ArticleResponse)
def create_article(data:ArticleCreate,db:Session=Depends(get_db)):
  article = Article(
    title=data.title,
    content = data.content,
    cover = data.cover,
    category_id = data.category_id,
    status = data.status
  )
  db.add(article)
  db.commit()
  db.refresh(article)
  return article

# 获取文章详情
@router.get("/{article_id}",response_model=ArticleResponse)
def get_article_detail(article_id:int,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  return article

# 修改文章
@router.put("/{article_id}",response_model=ArticleResponse)
def update_article(data:ArticleUpdate,article_id:int,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  article.title = data.title
  article.content = data.content
  article.cover = data.cover
  article.category_id = data.category_id
  article.status = data.status
  db.commit()
  db.refresh(article)
  return article

# 移至回收站
@router.delete("/{article_id}")
def delete_article(article_id:int,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  article.status = "trash"
  db.commit()
  return{
    "message":"已移入回收站"
  }

# 获得回收站文章
@router.get("/trash",response_model=list[ArticleResponse])
def get_trash_article(db:Session=Depends(get_db)):
  articles = db.query(Article).filter(Article.status=="trash").all()
  return articles

# 恢复文章
@router.patch("/{article_id}/restore")
def restore_article(article_id:int,db:Session=Depends(get_db)):
  article = db.query(Article).filter(Article.id==article_id).first()
  if not article:
    raise HTTPException(
      status_code=404,
      detail="文章不存在"
    )
  article.status=(article.old_status or "draft")
  article.old_status = None
  db.commit()
  return{
    "message":"恢复成功"
  }

# 批量恢复文章
@router.patch("/batch/retore")
def batch_restore(ids:list[int],db:Session=Depends(get_db)):
  articles = db.query(Article).filter(Article.id.in_(ids))
  for article in articles:
    article.status=(article.old_status or "draft")
    article.old_status=None
    return{
      "message":"批量恢复成功"
    }

# 彻底删除文章
@router.delete("/{article_id}/force")
def force_delete_article(article_id:int,db:Session=Depends(get_db)):
   article = db.query(Article).filter(Article.id==article_id).first()
   if not article:
      raise HTTPException(
        status_code=404,
        detail="文章不存在"
      )
   db.delete(article)
   db.commit()
   return{
     "message":"文章已彻底删除"
   }

# 批量删除文章
@router.delete("/batch/force")
def batch_force_delete(data:BatchDelete,db:Session=Depends(get_db)):
  articles = db.query(Article).filter(Article.id.in_(data.ids))
  for article in articles:
    db.delete(article)
  db.commit()
  return{
    "message":f"成功删除{len(articles)}篇文章"
  }

# 修改文章状态
@router.patch("/{article_id}/status")
def update_article_status(article_id:int,data:ArticleStatus,db:Session=Depends(get_db)):
   article = db.query(Article).filter(Article.id==article_id).first()
   if not article:
      raise HTTPException(
        status_code=404,
        detail="文章不存在"
      )
   article.status = data.status
   db.commit()
   return{
     "message":"文章状态修改成功"
   }



