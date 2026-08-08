from sqlalchemy import String,Integer,DateTime
from sqlalchemy.orm import Mapped,mapped_column
from app.database import Base
from datetime import datetime

class User(Base):
  __tablename__ = "users"

  id:Mapped[int] = mapped_column(
    Integer,
    primary_key=True,
    index=True
  )

  username:Mapped[str] = mapped_column(
    String(50),
    unique=True,
    nullable=False
  )
  
  email:Mapped[str] = mapped_column(
    String(100)
  )

  password:Mapped[str] = mapped_column(
      String(255)
  )


  role:Mapped[str] = mapped_column(
      String(20),
      default="user"
  )


  status:Mapped[str] = mapped_column(
      String(20),
      default="active"
  )


  create_time:Mapped[datetime] = mapped_column(
      DateTime,
      default=datetime.now
  )