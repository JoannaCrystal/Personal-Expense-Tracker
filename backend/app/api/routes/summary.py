from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.db.session import get_db
from app.db import crud
from app.schemas.summary import CategorySummary, MonthlySummary
from app.models.users import User

# Use the same SECRET_KEY and ALGORITHM as your auth.py
SECRET_KEY = "your-very-secret-key"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

router = APIRouter()

@router.get("/categories", response_model=list[CategorySummary])
def get_category_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return total spend per category for the authenticated user."""
    rows = crud.get_expense_summary_by_category(db, current_user.id)
    return [CategorySummary(category=cat, total_amount=total) for cat, total in rows]

@router.get("/monthly", response_model=list[MonthlySummary])
def get_monthly_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return total spend by month for the authenticated user."""
    rows = crud.get_expense_summary_by_month(db, current_user.id)
    return [MonthlySummary(month=month, total_amount=total) for month, total in rows]
