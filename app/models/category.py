from app.database import Base
from sqlalchemy import String,DateTime
from sqlalchemy.orm import Mapped,mapped_column
from datetime import datetime
from app.models.article import Article
from sqlalchemy.orm import relationship

class Category(Base):
  __tablename__ = "categories"
  
  id:Mapped[int] = mapped_column(
       primary_key=True,
       index=True,
        autoincrement=True
  )
  name: Mapped[str] = mapped_column(
      String(50),
      nullable=False,
      unique=True
  )

  description: Mapped[str | None] = mapped_column(
      String(200),
      nullable=True
  )

  create_time: Mapped[datetime] = mapped_column(
      DateTime,
      default=datetime.now,
      nullable=False
  )

  articles:Mapped[list["Article"]] = relationship(back_populates="category")
