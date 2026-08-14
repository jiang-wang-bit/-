from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import Article
from app.models.favorites import ArticleFavorite
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/favorites",
    tags=["收藏"]
)

@router.get("")
def get_user_favorites(
    user:User=Depends(get_current_user),
    db:Session=Depends(get_db)
):

    articles = (
        db.query(Article)
        .join(
            ArticleFavorite,
            Article.id == ArticleFavorite.article_id
        )
        .filter(
            ArticleFavorite.user_id == user.id
        )
        .all()
    )


    return articles