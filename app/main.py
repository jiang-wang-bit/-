from fastapi import FastAPI
from app.models.user import User
from app.models import article
from app.database import Base,engine
from app.routers import user
from app.routers import article
from app.models.article_like import ArticleLike
from app.models.favorites import ArticleFavorite
from app.routers import article_like
from app.routers import article_favorite
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(article.router)
app.include_router(article_like.router)
app.include_router(article_favorite.router)

@app.get("/")
def root():
  return {
    "message":"blog server running"
  }