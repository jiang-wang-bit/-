# Blog Server

## 技术栈

- FastAPI
- SQLAlchemy
- MySQL
- Pydantic


## 安装

创建虚拟环境:

python -m venv .venv


安装依赖:

pip install -r requirements.txt


## 配置数据库

创建 .env

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=blog_system


## 启动

uvicorn app.main:app --reload