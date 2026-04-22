import databases
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base

DATABASE_URL = "sqlite:///./farm_assistant.db"

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()
Base = declarative_base()

engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
