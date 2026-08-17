from sqlalchemy import Integer,DateTime,ForeignKey,UniqueConstraint
from sqlalchemy.orm import Mapped,mapped_column,relationship
from app.database import Base
from datetime import datetime

class ArticleFavorite(Base):
  __tablename__ = "article_favorites"
  __table_args__=(
        UniqueConstraint(
            "user_id",
            "article_id"
        ),

    )
  id:Mapped[int] =mapped_column(
    Integer,
    primary_key=True
  )
  user_id:Mapped[int]=mapped_column(
    ForeignKey("users.id")
  )
  article_id:Mapped[int]=mapped_column(
    ForeignKey("articles.id")
  )
  create_time:Mapped[datetime]=mapped_column(
        DateTime,
        default=datetime.now
    )
  article = relationship(
      "Article",
      back_populates="favorites"
  )