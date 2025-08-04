from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.db import crud
from app.schemas.categories import CategoryCreate, CategoryOut
from app.db.session import get_db

router = APIRouter()

# JWT config - ensure these match your auth config
SECRET_KEY = "your-very-secret-key"  # Replace with your actual secret
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
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

@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new expense category for the authenticated user.
    """
    existing = crud.get_category_by_name(db, category.name)
    if existing and existing.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Category already exists")
    return crud.create_category(db, category, current_user.id)

@router.get("/", response_model=List[CategoryOut])
def list_categories(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all expense categories for the authenticated user.
    """
    return db.query(crud.Category).filter(crud.Category.user_id == current_user.id).all()
