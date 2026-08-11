from sqlalchemy import Integer,DateTime,ForeignKey
from sqlalchemy.orm import Mapped,mapped_column
from datetime import datetime
from app.database import Base

class CommentLike(Base):
  __tablename__ = "comment_likes"

  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True
  )

  comment_id:Mapped[int] = mapped_column(
    Integer,
    ForeignKey("comments.id")
  )

  user_id:Mapped[int] = mapped_column(
    Integer,
    ForeignKey("users.id")
  )

  create_time:Mapped[DateTime] = mapped_column(
    DateTime,
    default=datetime.now
  )