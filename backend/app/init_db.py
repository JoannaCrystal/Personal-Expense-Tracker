# backend/app/init_db.py

from app.db.session import engine
from app import models
from app.db.base import Base

# Ensure all models are imported so Base.metadata.create_all can see them
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully.")
