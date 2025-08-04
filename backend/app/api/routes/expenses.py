# backend/app/api/routes/expenses.py

from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db import crud
from app.schemas.expenses import ExpenseCreate, ExpenseOut
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(expense: ExpenseCreate, account_id: int, db: Session = Depends(get_db)):
    """
    Create a new expense for a specific account.
    """
    # Optional: Validate account_id exists
    return crud.create_expense(db, expense, account_id)

@router.get("/", response_model=List[ExpenseOut])
def list_expenses(
    account_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get expenses filtered by account, optional date range, and category.
    """
    return crud.get_expenses_by_filters(db, account_id, start_date, end_date, category_id)
