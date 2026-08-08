from sqlalchemy import String,Integer,TEXT,DateTime
from sqlalchemy.orm import mapped_column,Mapped
from datetime import datetime
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
      Integer
  )


  status: Mapped[str] = mapped_column(
      String(20),
      default="draft"
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

