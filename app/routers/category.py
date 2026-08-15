from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.category import Category
from app.models.article import Article
from app.schemas.category import (CategoryCreate,CategoryResponse,CategoryUpdate)

router = APIRouter(
  prefix="/categories",
  tags=["分类管理"]
)
# 回收站
@router.get("/trash")
def get_deleted_categories(
   db:Session=Depends(get_db)
):
   categories = db.query(Category).filter(Category.status=="deleted").all()
   return categories

# 获取分类列表
@router.get("",response_model=list[CategoryResponse])
def get_categories(db:Session=Depends(get_db)):
  result = (
     db.query(Category,func.count(Article.id).label("article_count")).outerjoin(Article,Article.category_id==Category.id).filter(Category.status=="active").group_by(Category.id).order_by(Category.create_time.desc()).all()
  )
  data=[]
  for category,count in result:
     data.append({

            "id":category.id,

            "name":category.name,

            "description":category.description,

            "status":category.status,

            "create_time":category.create_time,

            "article_count":count

        })
  return data

# 获取单个分类
@router.get("/{id}",response_model=CategoryResponse)
def get_category(id:int,db:Session=Depends(get_db)):
  category = db.query(Category).filter(Category.id==id).first()
  if not category:
    raise HTTPException(
      status_code=404,
      detail="分类不存在"
    )
  return category

# 创建分类
@router.post("",response_model=CategoryResponse)
def create_category(data:CategoryCreate,db:Session=Depends(get_db)):
  active = (
      db.query(Category)
      .filter(
          Category.name==data.name,
          Category.status=="active"
      )
      .first()
  )

  if active:
      raise HTTPException(
          status_code=400,
          detail="分类已经存在"
      )


  # 检查回收站
  deleted = (
      db.query(Category)
      .filter(
          Category.name==data.name,
          Category.status=="deleted"
      )
      .first()
  )

  if deleted:
      raise HTTPException(
          status_code=400,
          detail="该分类存在于回收站，请先恢复"
      )
  
  category = Category(
    name=data.name,
    description = data.description,
    status="active"
  )
  db.add(category)
  db.commit()
  db.refresh(category)
  return category

# 修改分类
@router.put("/{id}",response_model=CategoryResponse)
def update_category(data:CategoryUpdate,id:int,db:Session=Depends(get_db)):
   category = db.query(Category).filter(Category.id==id).first()
   if not category:
       raise HTTPException(
         status_code=404,
         detail="分类不存在"
       )
   category.name = data.name
   category.description = data.description
   db.commit()
   db.refresh(category)
   return category

# 删除分类
@router.delete("/{id}")
def delete_category(id:int,db:Session=Depends(get_db)):
   category = db.query(Category).filter(Category.id==id).first()
   if not category:
      raise HTTPException(
        status_code=404,
        detail="分类不存在"
      )
   
  #  查询该分类文章数量
   article_count = db.query(Article).filter(Article.category_id==id).count()
   if article_count>0:
      raise HTTPException(
         status_code=400,
         detail=f"该分类下存在{article_count}篇文章,无法删除"
      )
   category.status="deleted"
   db.commit()
   return{
      "message":"删除成功"
   }

# 恢复分类
@router.put("/{id}/restore")
def restore_category(id:int,db:Session=Depends(get_db)):
   category = db.query(Category).filter(Category.id==id).first()
   if not category:
      raise HTTPException(
         status_code=404,
         detail="分类不存在"
      )
   category.status="active"
   db.commit()
   return{
      "message":"恢复成功"
   }

# 彻底删除分类
@router.delete("/{id}/force")
def forcr_delete_category(id:int,db:Session=Depends(get_db)):
   category = db.query(Category).filter(Category.id==id).first()
   if not category:
      raise HTTPException(
         status_code=404,
         detail="分类不存在"
      )
   db.delete(category)
   db.commit()
   return{
      "message":"永久删除成功"
   }
