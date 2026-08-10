from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.user import User
from app.models import article
from app.database import Base,engine
from app.routers import user
from app.routers import article
from app.models.article_like import ArticleLike
from app.models.favorites import ArticleFavorite
from app.routers import article_like
from app.routers import article_favorite
from app.routers import article_view
from app.routers import comment
from app.routers import category
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(article.router)
app.include_router(article_like.router)
app.include_router(article_favorite.router)
app.include_router(article_view.router)
app.include_router(comment.router)
app.include_router(category.router)
# 跨域问题
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
  return {
    "message":"blog server running"
  }