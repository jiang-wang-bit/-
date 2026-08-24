from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.schemas.category import BatchTrashSchema,BatchRestoreSchema
from app.models.category import Category
from app.models.article import Article
from app.schemas.category import (CategoryCreate,CategoryListResponse,CategoryResponse,CategoryUpdate)

router = APIRouter(
  prefix="/categories",
  tags=["分类管理"]
)
# 回收站
@router.get("/trash")
def get_deleted_categories(
   db:Session=Depends(get_db)
):
   categories = db.query(Category).filter(Category.status=="trash").all()
   return categories

# 获取分类列表
@router.get("",response_model=CategoryListResponse)
def get_categories(page:int=Query(1),pageSize:int=Query(10),keyword:str|None=Query(None),db:Session=Depends(get_db)):
  query = (db.query(Category,func.count(Article.id).label("article_count")).outerjoin(Article,Article.category_id==Category.id).filter(Category.status=="active"))

#   搜索
  if keyword:
     query = query.filter(Category.name.like(f"%{keyword}%"))

   # 总数量
  total = (query.group_by(Category.id).count())

  result = (
    query.group_by(Category.id).order_by(Category.create_time.desc()).offset((page-1)*pageSize).limit(pageSize).all()
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
  return {
     "list":data,
     "total":total
  }

@router.get("/stats")
def get_category_stats(
    db:Session=Depends(get_db)
):

    categories = db.query(Category).all()
    result=[]
    for category in categories:

        count = db.query(Article)\
            .filter(
                Article.category_id==category.id,
                Article.status=="published"
            )\
            .count()

        result.append({

            "id":category.id,

            "name":category.name,

            "article_count":count

        })

    return result

# 批量删除函数
@router.delete("/batch-trash")
def batch_trash(data:BatchTrashSchema,db:Session=Depends(get_db)):
   categories = db.query(Category).filter(Category.id.in_(data.ids)).all()
   for category in categories:

      count = (
         db.query(Article)
         .filter(
               Article.category_id == category.id
         )
         .count()
      )
      if count > 0:
            raise HTTPException(
                status_code=400,
                detail=f"{category.name}下面还有{count}文章，无法删除"
            )
      category.status = "trash"
   db.commit()
   return{
      "message":"已经移动到回收站"
   }

# 批量恢复
@router.put("/batch-restore")
def batch_restore(data:BatchRestoreSchema,db:Session=Depends(get_db)):
   categories = (db.query(Category).filter(Category.id.in_(data.ids))).all()
   for category in categories:
      category.status="active"
   db.commit()
   return{
      "message":"批量恢复成功"
   }

# 批量永久删除
@router.delete("/batch-delete")
def batch_delete(data:BatchTrashSchema,db:Session=Depends(get_db)):
   categories = (db.query(Category).filter(Category.id.in_(data.ids),Category.status=="trash").all())
   for category in categories:
      db.delete(category)
   db.commit()
   return{
      "message":"批量永久删除成功"
   }

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
          Category.status=="active",
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
    status="active",
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

# 获得分类文章
@router.get("/{id}/articles")
def get_articles_by_category(id:int,db:Session=Depends(get_db)):
  category = db.query(Category)\
        .filter(Category.id==id)\
        .first()


  articles = db.query(Article)\
   .filter(
      Article.category_id==id
   ).all()


  return {
      "category":category,
      "articles":articles
   }



