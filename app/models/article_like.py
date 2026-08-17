from app.database import Base
from sqlalchemy import Integer,ForeignKey,DateTime,UniqueConstraint
from sqlalchemy.orm import mapped_column,Mapped,relationship
from datetime import datetime
class ArticleLike(Base):
  __tablename__ = "article_likes"
  __table_args__=(
    UniqueConstraint(
      "user_id",
      "article_id"
    ),
  )
  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True
  )
  user_id:Mapped[int] = mapped_column(
    ForeignKey("users.id")
  )
  article_id:Mapped[int] = mapped_column(
    ForeignKey("articles.id")
  )
  create_time:Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.now
  )
  article = relationship(
        "Article",
        back_populates="like_records",
    )
