# expense-tracker/backend/app/models/category_mapping.py

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class CategoryMapping(Base):
    __tablename__ = "category_mappings"

    id = Column(Integer, primary_key=True, index=True)
    substring = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="mappings")
