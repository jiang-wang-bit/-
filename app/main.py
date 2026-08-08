from fastapi import FastAPI
from app.models.user import User
from app.models import article
from app.database import Base,engine
from app.routers import user
from app.routers import article
from app.models.article_like import ArticleLike
from app.models.favorites import ArticleFavorite

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router)
app.include_router(article.router)


@app.get("/")
def root():
  return {
    "message":"blog server running"
  }