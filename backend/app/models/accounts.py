# backend/app/models/accounts.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship to user (one user can have many accounts)
    user = relationship("User", back_populates="accounts")

    # Relationship to expenses (one account has many expenses)
    expenses = relationship("Expense", back_populates="account", cascade="all, delete-orphan")
