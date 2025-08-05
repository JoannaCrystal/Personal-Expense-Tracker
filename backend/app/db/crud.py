from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc, case
from typing import List, Optional
from datetime import date, datetime

from app.models.users import User
from app.models.accounts import Account
from app.models.expenses import Expense
from app.models.categories import Category
from app.schemas.users import UserCreate
from app.schemas.accounts import AccountCreate
from app.schemas.expenses import ExpenseCreate
from app.schemas.categories import CategoryCreate
from app.models.categories import CategoryMapping
from app.core.security import get_password_hash

# --- User CRUD ---

def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

# --- Account CRUD ---

def create_account(db: Session, account: AccountCreate, user_id: int) -> Account:
    db_account = Account(name=account.name, user_id=user_id)
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def get_accounts_by_user(db: Session, user_id: int) -> List[Account]:
    return db.query(Account).filter(Account.user_id == user_id).all()

def get_account_by_id(db: Session, account_id: int) -> Optional[Account]:
    return db.query(Account).filter(Account.id == account_id).first()

# --- Expense CRUD ---

def create_expense(db: Session, expense: ExpenseCreate, account_id: int) -> Expense:
    db_expense = Expense(
        transaction_date=expense.transaction_date,
        description=expense.description,
        amount=expense.amount,
        account_id=account_id,
        category_id=expense.category_id,
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

def get_expenses_by_account(db: Session, account_id: int) -> List[Expense]:
    return db.query(Expense).filter(Expense.account_id == account_id).all()

def get_expenses_by_filters(
    db: Session,
    account_id: int,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category_id: Optional[int] = None,
) -> List[Expense]:
    query = db.query(Expense).filter(Expense.account_id == account_id)
    if start_date:
        query = query.filter(Expense.transaction_date >= start_date)
    if end_date:
        query = query.filter(Expense.transaction_date <= end_date)
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    return query.all()

# --- Category CRUD ---

def create_category(db: Session, category: CategoryCreate, user_id: int) -> Category:
    db_category = Category(name=category.name, user_id=user_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_all_categories(db: Session) -> List[Category]:
    return db.query(Category).all()

def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    return db.query(Category).filter(Category.name == name).first()

# --- Category Mapping ---

def get_category_mapping_by_substring(db: Session, substring: str) -> Optional[CategoryMapping]:
    return db.query(CategoryMapping).filter(CategoryMapping.substring == substring).first()

def create_or_update_mapping(db: Session, substring: str, category_id: int) -> CategoryMapping:
    mapping = get_category_mapping_by_substring(db, substring)
    if mapping:
        mapping.category_id = category_id
    else:
        mapping = CategoryMapping(substring=substring, category_id=category_id)
        db.add(mapping)
    db.commit()
    db.refresh(mapping)
    return mapping

def assign_categories_to_unmapped_expenses(db: Session) -> None:
    unmapped = db.query(Expense).filter(Expense.category_id.is_(None)).all()
    for exp in unmapped:
        mapping = (
            db.query(CategoryMapping)
            .filter(CategoryMapping.substring.ilike(f"%{exp.description}%"))
            .first()
        )
        if mapping:
            exp.category_id = mapping.category_id
    db.commit()

# --- Summary Helpers ---

def get_expense_summary_by_category(db: Session, user_id: int):
    return (
        db.query(
            Category.name.label("category"),
            func.coalesce(func.sum(Expense.amount), 0).label("total_amount"),
        )
        .join(Expense, Expense.category_id == Category.id, isouter=True)
        .join(Account, Expense.account_id == Account.id)
        .filter(Account.user_id == user_id)
        .group_by(Category.name)
        .all()
    )

def get_expense_summary_by_month(db: Session, user_id: int):
    return (
        db.query(
            func.to_char(func.date_trunc('month', Expense.transaction_date), 'YYYY-MM').label("month"),
            func.coalesce(func.sum(Expense.amount), 0).label("total_amount"),
        )
        .join(Account, Expense.account_id == Account.id)
        .filter(Account.user_id == user_id)
        .group_by("month")
        .order_by("month")
        .all()
    )

# --- New for Reports ---

def get_latest_month_with_data(db: Session, user_id: int) -> Optional[str]:
    latest_date = (
        db.query(func.max(Expense.transaction_date))
        .join(Account, Expense.account_id == Account.id)
        .filter(Account.user_id == user_id)
        .scalar()
    )
    return latest_date.strftime('%Y-%m') if latest_date else None

def get_income_expense_for_month(db: Session, user_id: int, year: int, month: int):
    return (
        db.query(
            func.sum(
                case((Expense.amount >= 0, Expense.amount), else_=0)
            ).label("total_expense"),
            func.sum(
                case((Expense.amount < 0, Expense.amount), else_=0)
            ).label("total_income"),
        )
        .join(Account, Expense.account_id == Account.id)
        .filter(
            Account.user_id == user_id,
            extract("year", Expense.transaction_date) == year,
            extract("month", Expense.transaction_date) == month,
        )
        .first()
    )

def get_expense_by_category_for_month(db: Session, user_id: int, year: int, month: int):
    return (
        db.query(
            Category.name.label("category"),
            func.coalesce(func.sum(Expense.amount), 0).label("total")
        )
        .join(Expense, Expense.category_id == Category.id)
        .join(Account, Expense.account_id == Account.id)
        .filter(
            Account.user_id == user_id,
            extract("year", Expense.transaction_date) == year,
            extract("month", Expense.transaction_date) == month,
            Expense.amount >= 0
        )
        .group_by(Category.name)
        .all()
    )

def get_income_expense_by_year(db: Session, user_id: int, year: int):
    return (
        db.query(
            extract("month", Expense.transaction_date).label("month"),
            func.sum(
                case((Expense.amount >= 0, Expense.amount), else_=0)
            ).label("total_expense"),
            func.sum(
                case((Expense.amount < 0, Expense.amount), else_=0)
            ).label("total_income"),
        )
        .join(Account, Expense.account_id == Account.id)
        .filter(
            Account.user_id == user_id,
            extract("year", Expense.transaction_date) == year,
        )
        .group_by("month")
        .order_by("month")
        .all()
    )

def get_top_expense_categories(db: Session, user_id: int, top_n: int = 5):
    return (
        db.query(
            Category.name.label("category"),
            func.sum(Expense.amount).label("total")
        )
        .join(Expense, Expense.category_id == Category.id)
        .join(Account, Expense.account_id == Account.id)
        .filter(Account.user_id == user_id, Expense.amount >= 0)
        .group_by(Category.name)
        .order_by(desc("total"))
        .limit(top_n)
        .all()
    )
