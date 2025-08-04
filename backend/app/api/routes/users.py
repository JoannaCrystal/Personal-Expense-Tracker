# backend/app/api/routes/users.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.users import UserOut
from app.db.session import get_db
from app.db import crud

router = APIRouter()

@router.get("/", response_model=List[UserOut], summary="Get list of users")
def read_users(skip: int = 0, limit: int = Query(10, le=100), db: Session = Depends(get_db)):
    """
    Retrieve users with pagination.
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=UserOut, summary="Get a user by ID")
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single user by ID.
    """
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
