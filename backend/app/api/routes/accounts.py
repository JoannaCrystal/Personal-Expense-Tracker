# backend/app/api/routes/accounts.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import crud
from app.schemas.accounts import AccountCreate, AccountOut
from app.db.session import get_db

router = APIRouter()

@router.post("/", response_model=AccountOut, status_code=status.HTTP_201_CREATED)
def create_account(account: AccountCreate, user_id: int, db: Session = Depends(get_db)):
    """
    Create a new account for a user.
    """
    # Optionally, check if user_id exists in your user table here.
    return crud.create_account(db, account, user_id)

@router.get("/", response_model=List[AccountOut])
def list_accounts(user_id: int, db: Session = Depends(get_db)):
    """
    List all accounts for a given user.
    """
    return crud.get_accounts_by_user(db, user_id)

@router.get("/{account_id}", response_model=AccountOut)
def get_account(account_id: int, db: Session = Depends(get_db)):
    """
    Get account details by ID.
    """
    account = crud.get_account_by_id(db, account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
