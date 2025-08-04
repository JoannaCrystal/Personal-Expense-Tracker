from pydantic import BaseModel
from datetime import date
from typing import Optional


class ExpenseBase(BaseModel):
    transaction_date: date
    description: str
    amount: float


class ExpenseCreate(ExpenseBase):
    account_id: int  # The account this expense belongs to


class ExpenseOut(ExpenseBase):
    id: int
    account_id: int
    category_id: Optional[int]  # Can be null if not mapped yet

    class Config:
        orm_mode = True
