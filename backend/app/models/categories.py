from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # new column

    # Relationship to user
    user = relationship("User", back_populates="categories")

    # Relationship to expenses
    expenses = relationship("Expense", back_populates="category")

    # Relationship to description mappings (category mappings)
    description_mappings = relationship(
        "CategoryMapping",
        back_populates="category",
        cascade="all, delete-orphan"
    )

class CategoryMapping(Base):
    __tablename__ = "category_mappings"

    id = Column(Integer, primary_key=True, index=True)
    substring = Column(String, unique=True, nullable=False)  # e.g. "Starbucks", "Uber", etc.

    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    # Relationship to category
    category = relationship("Category", back_populates="description_mappings")
