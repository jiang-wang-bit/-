from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.category import Category
from app.schemas.category import (CategoryCreate,CategoryResponse,CategoryUpdate)

router = APIRouter(
  prefix="/categories",
  tags=["分类管理"]
)

# 获取分类列表
@router.get("",response_model=list[CategoryResponse])
def get_categories(db:Session=Depends(get_db)):
  categories = db.query(Category).order_by(Category.create_time.desc()).all()
  return categories

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
  exits = db.query(Category).filter(Category.name==data.name)
  if exits:
    raise HTTPException(
      status_code=400,
      detail="分类已存在"
    )
  category = Category(
    name=data.name,
    description = data.description
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
   db.delete(category)
   db.commit()
   return{
      "message":"删除成功"
   }