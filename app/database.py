from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase,sessionmaker


DATABASE_URL = (
    "mysql+pymysql://root:abcd123456@localhost:3306/blog_system"
)

engine = create_engine(DATABASE_URL,echo=True)

SessionLocal = sessionmaker(autoflush=False,autocommit=False,bind=engine)

class Base(DeclarativeBase):
  pass