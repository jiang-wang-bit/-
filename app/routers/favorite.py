from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.article import Article
from app.models.favorites import ArticleFavorite


router = APIRouter(
    prefix="/favorites",
    tags=["收藏"]
)



@router.get("")
def get_user_favorites(
    user_id:int,
    db:Session=Depends(get_db)
):

    articles = (
        db.query(Article)
        .join(
            ArticleFavorite,
            Article.id == ArticleFavorite.article_id
        )
        .filter(
            ArticleFavorite.user_id == user_id
        )
        .all()
    )


    return articles