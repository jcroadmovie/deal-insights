import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .schema import Base, Deal, User, Memo

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./deals.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables on import for demo purposes
Base.metadata.create_all(engine)

__all__ = ["Deal", "User", "Memo", "SessionLocal"]
