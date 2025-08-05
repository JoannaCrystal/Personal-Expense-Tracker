"""
Pydantic schemas for category-to-substring mappings.

These models are used by the mapping API endpoints to validate request
payloads and to serialize responses. A mapping associates one or
more substrings with a particular category. When an expense
description contains a mapped substring, the expense will be
automatically assigned to the corresponding category.
"""

from pydantic import BaseModel, Field
from typing import List


class MappingCreate(BaseModel):
    category_id: int = Field(..., example=1)
    substrings: List[str] = Field(..., example=["Uber", "Lyft", "RideShare"])

    class Config:
        schema_extra = {
            "example": {
                "category_id": 1,
                "substrings": ["Uber", "Lyft", "RideShare"]
            }
        }


class MappingOut(BaseModel):
    category_id: int
    category_name: str
    substring: str

    class Config:
        orm_mode = True
