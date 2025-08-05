from pydantic import BaseModel
from typing import Optional

class CategorySummary(BaseModel):
    category: Optional[str]  # None for uncategorised expenses
    total_amount: float

class MonthlySummary(BaseModel):
    month: str    # formatted as 'YYYY-MM'
    total_amount: float
