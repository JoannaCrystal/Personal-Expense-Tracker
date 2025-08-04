from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relationship to accounts (one user can have many accounts)
    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")

    # Relationship to categories (one user can have many categories)
    categories = relationship("Category", back_populates="user", cascade="all, delete-orphan")
