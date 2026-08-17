from sqlalchemy import Integer,ForeignKey,DateTime,String
from sqlalchemy.orm import mapped_column,Mapped,relationship
from datetime import datetime
from app.database import Base

class ArticleView(Base):
  __tablename__ = "article_views"

  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True
  )

  article_id:Mapped[int] = mapped_column(
    ForeignKey("articles.id")
  )

  user_id:Mapped[int] = mapped_column(
    ForeignKey("users.id")
  )

  ip:Mapped[str|None] = mapped_column(
    String(50),
    nullable=True
  )

  create_time:Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.now
  )
  article = relationship(
        "Article",
        back_populates="view_records"
    )