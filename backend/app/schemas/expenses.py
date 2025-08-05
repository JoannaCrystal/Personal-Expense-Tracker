# backend/app/schemas/expenses.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

class ExpenseBase(BaseModel):
    transaction_date: date
    description: str
    amount: float

class ExpenseCreate(ExpenseBase):
    account_id: int
    category_id: Optional[int] = None  # ← allow category_id during create

class ExpenseOut(ExpenseBase):
    id: int
    account_id: int
    category_id: Optional[int]

    class Config:
        orm_mode = True
