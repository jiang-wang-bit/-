from sqlalchemy.orm import Mapped,mapped_column,relationship
from sqlalchemy import Integer,ForeignKey,DateTime
from datetime import datetime
from app.database import Base

class ArticleHistory(Base):
  __tablename__ = "article_history"
  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True,
    index=True
  )

  user_id:Mapped[int] = mapped_column(
    Integer,
    ForeignKey("users.id")
  )

  article_id:Mapped[int] = mapped_column(
    Integer,
    ForeignKey("articles.id")
  )

  create_time:Mapped[DateTime] = mapped_column(
    DateTime,
    default=datetime.now
  )
  article = relationship(
        "Article",
        back_populates="histories"
    )
