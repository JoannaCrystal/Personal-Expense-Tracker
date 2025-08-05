# backend/app/api/routes/expenses.py
from typing import List, Optional
from datetime import date
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import pandas as pd
from app.db import crud
from app.schemas.expenses import ExpenseCreate, ExpenseOut
from app.db.session import get_db
from app.models.categories import CategoryMapping
from app.models.accounts import Account
from app.models.users import User

# Secret key and algorithm must match your auth.py
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

@router.post("/", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a single expense for the authenticated user."""
    account = crud.get_account_by_id(db, expense.account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    return crud.create_expense(db, expense, expense.account_id)

@router.get("/", response_model=List[ExpenseOut])
def list_expenses(
    account_id: int,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    category_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return expenses for the user’s account, optionally filtered."""
    account = crud.get_account_by_id(db, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")
    return crud.get_expenses_by_filters(db, account_id, start_date, end_date, category_id)

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_expenses(
    account_id: int = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload an Excel file of expenses. Required columns (case-insensitive):
    `transaction_date`, `description`, `amount`. An optional `category_id` column
    can be provided. If no `category_id` is provided, we look up matching
    substrings in CategoryMapping to assign a category.
    """
    account = crud.get_account_by_id(db, account_id)
    if not account or account.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Account not found")

    try:
        contents = await file.read()
        import io
        df = pd.read_excel(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse Excel file: {exc}")

    # Normalize headers to lowercase for easier matching
    df.columns = [c.lower() for c in df.columns]
    required_columns = {"transaction_date", "description", "amount"}
    if not required_columns.issubset(df.columns):
        missing = required_columns - set(df.columns)
        raise HTTPException(status_code=400, detail=f"Missing required columns: {', '.join(missing)}")

    created_count = 0
    for _, row in df.iterrows():
        try:
            tr_date = pd.to_datetime(row["transaction_date"]).date()
            desc = str(row["description"]).strip()
            amount = float(row["amount"])
        except Exception:
            continue

        # Determine category_id
        cat_id = None
        if "category_id" in row and pd.notna(row["category_id"]):
            try:
                cat_id = int(row["category_id"])
            except Exception:
                cat_id = None
        else:
            # Find a CategoryMapping whose substring appears in the description
            mapping = (
                db.query(CategoryMapping)
                .filter(CategoryMapping.substring.ilike(f"%{desc}%"))
                .first()
            )
            if mapping:
                cat_id = mapping.category_id

        exp = ExpenseCreate(
            transaction_date=tr_date,
            description=desc,
            amount=amount,
            account_id=account_id,
            category_id=cat_id,
        )
        crud.create_expense(db, exp, account_id)
        created_count += 1

    return {"detail": f"Successfully uploaded {created_count} expenses."}
