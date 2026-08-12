from sqlalchemy import String,Integer,TEXT,DateTime,ForeignKey
from sqlalchemy.orm import mapped_column,Mapped,relationship
from datetime import datetime
# from app.models.category import Category
from app.database import Base

class Article(Base):
  __tablename__ = "articles"
  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True,
    index=True
  )
  title:Mapped[str] = mapped_column(
    String(200),
    nullable=False
  )
  content:Mapped[str] = mapped_column(
    TEXT,
    nullable=False
  )
  cover:Mapped[str|None] = mapped_column(
    String(500),
    nullable=True
  )
  author: Mapped[str] = mapped_column(
      String(50),
      default="admin"
  )


  category_id: Mapped[int] = mapped_column(
      ForeignKey("categories.id"),
       nullable=False
  )

  category:Mapped["Category"] = relationship(back_populates="articles")


  status: Mapped[str] = mapped_column(
      String(20),
      default="published"
  )

  old_status:Mapped[str] = mapped_column(
    String(20),
    nullable=True
  )

  views: Mapped[int] = mapped_column(
      Integer,
      default=0
  )


  likes: Mapped[int] = mapped_column(
      Integer,
      default=0
  )


  create_time: Mapped[datetime] = mapped_column(
      DateTime,
      default=datetime.now
  )


  update_time: Mapped[datetime] = mapped_column(
      DateTime,
      default=datetime.now,
      onupdate=datetime.now
  )
  comments = relationship(
        "Comment",
        back_populates="article"
    )

