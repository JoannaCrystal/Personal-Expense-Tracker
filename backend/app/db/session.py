from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# Read from environment variable, with a fallback
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://expenseuser:expensepass@ls-aae7daea72bfa0165062c49a769feefc76ed6f1b.cific46u4onk.us-east-1.rds.amazonaws.com:5432/expensedb"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
