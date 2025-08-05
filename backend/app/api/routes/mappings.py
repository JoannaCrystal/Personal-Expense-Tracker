"""
API routes for managing category mappings.

These endpoints allow an authenticated user to view existing
description‑to‑category mappings and to create new mappings.

When a new mapping is created, the backend assigns the selected
category to any previously unmapped expenses whose descriptions
contain the provided substrings. This keeps expense data consistent.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.db.session import get_db
from app.db import crud
from app.schemas.mapping import MappingCreate, MappingOut
from app.models.users import User
from app.models.categories import CategoryMapping

# Secret key and algorithm should match your auth settings
SECRET_KEY = "your-very-secret-key"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

router = APIRouter(tags=["category mappings"])


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Decode JWT and return authenticated user"""
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


@router.get("/", response_model=list[MappingOut])
def list_mappings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Return all substring→category mappings for the authenticated user.
    """
    mappings = (
        db.query(CategoryMapping)
        .join(CategoryMapping.category)
        .filter(CategoryMapping.category.has(user_id=current_user.id))
        .all()
    )
    return [
        MappingOut(category_id=m.category_id, category_name=m.category.name, substring=m.substring)
        for m in mappings
    ]


@router.post("/", status_code=201)
def add_mapping(
    mapping: MappingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add one or more substrings that map to a selected category.
    If any substring already exists, raise an error.
    """
    category = db.query(crud.Category).filter(
        crud.Category.id == mapping.category_id,
        crud.Category.user_id == current_user.id
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    created = []
    for substr in mapping.substrings:
        existing = crud.get_category_mapping_by_substring(db, substr)
        if existing:
            raise HTTPException(status_code=400, detail=f"Substring '{substr}' already mapped")
        new_map = crud.create_or_update_mapping(db, substring=substr, category_id=category.id)
        created.append(new_map)

    # Reassign categories for any unmapped expenses that now match
    crud.assign_categories_to_unmapped_expenses(db)

    return {
        "message": f"✅ Created {len(created)} mapping(s) for category '{category.name}'."
    }
