from sqlalchemy import Integer,String,DateTime,ForeignKey,Boolean
from sqlalchemy.orm import Mapped,mapped_column,relationship
from app.database import Base
from datetime import datetime

class Comment(Base):
  __tablename__ = "comments"

  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True
  )
  article_id:Mapped[int] = mapped_column(
    ForeignKey("articles.id"),
    nullable=False
  )
  article = relationship(
        "Article",
        back_populates="comments"
    )
  user_id:Mapped[int] = mapped_column(
    ForeignKey("users.id"),
    nullable=False
  )
  content:Mapped[str] = mapped_column(
    String(500),
    nullable=False
  )
  parent_id:Mapped[int|None] = mapped_column(
    ForeignKey("comments.id"),
    nullable=True
  )
  status:Mapped[str] = mapped_column(
    String(20),
    default="pending"
  )
  likes:Mapped[int] = mapped_column(
    Integer,
    default=0
  )
  create_time:Mapped[datetime] = mapped_column(
    DateTime,
    default=datetime.now
  )
  
    # 父评论
  parent = relationship(
        "Comment",
        remote_side=[id],
        back_populates="children",
         foreign_keys=[parent_id]
    )


    # 子评论
  children = relationship(
        "Comment",
        back_populates="parent",
         passive_deletes=True
    )

  is_placeholder: Mapped[bool] = mapped_column(
    Boolean,
    default=False
)