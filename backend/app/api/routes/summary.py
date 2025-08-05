from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from typing import Optional
from datetime import date

from app.db.session import get_db
from app.db import crud
from app.schemas.summary import CategorySummary, MonthlySummary
from app.models.users import User

SECRET_KEY = "your-very-secret-key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")
router = APIRouter(tags=["summary"])


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


@router.get("/categories", response_model=list[CategorySummary])
def get_category_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = crud.get_expense_summary_by_category(db, current_user.id)
    return [
        CategorySummary(
            category=cat or "Uncategorized",
            total_amount=total,
        )
        for cat, total in rows
    ]


@router.get("/monthly", response_model=list[MonthlySummary])
def get_monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = crud.get_expense_summary_by_month(db, current_user.id)
    return [
        MonthlySummary(
            month=month,
            total_amount=total,
        )
        for month, total in rows
    ]


@router.get("/", response_model=dict)
def get_combined_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cat_rows = crud.get_expense_summary_by_category(db, current_user.id)
    month_rows = crud.get_expense_summary_by_month(db, current_user.id)

    category_summary = [
        {"category": cat or "Uncategorized", "total_amount": total}
        for cat, total in cat_rows
    ]
    monthly_summary = [
        {"month": month, "total_amount": total}
        for month, total in month_rows
    ]

    return {
        "category_summary": category_summary,
        "monthly_summary": monthly_summary,
    }


@router.get("/reports")
def get_visual_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    category_id: Optional[int] = Query(None),
    top_n: int = Query(5)
):
    user_id = current_user.id

    # 1. Latest month pie chart: income vs expense
    latest_month = crud.get_latest_month_with_data(db, user_id)
    pie_data = {}
    bar_data = []
    if latest_month:
        year, month = map(int, latest_month.split("-"))
        pie = crud.get_income_expense_for_month(db, user_id, year, month)
        pie_data = {
            "month": latest_month,
            "total_income": float(pie.total_income or 0),
            "total_expense": float(pie.total_expense or 0),
        }

        # 2. Bar chart: expense per category for latest month
        bar_rows = crud.get_expense_by_category_for_month(db, user_id, year, month)
        bar_data = [{"category": cat, "total": float(total)} for cat, total in bar_rows]

    # 3. Line chart: current year income/expense trend
    year = date.today().year
    line_rows = crud.get_income_expense_by_year(db, user_id, year)
    line_data = [
        {
            "month": int(month),
            "total_income": float(inc),
            "total_expense": float(exp),
        }
        for month, exp, inc in line_rows
    ]

    # 4. Bottom-right: Top N categories
    top_rows = crud.get_top_expense_categories(db, user_id, top_n)
    top_categories = [{"category": cat, "total": float(total)} for cat, total in top_rows]

    return {
        "pie": pie_data,
        "bar": bar_data,
        "line": line_data,
        "top_categories": top_categories,
    }
