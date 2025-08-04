from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass  # frontend only sends 'name', user_id set in backend

class CategoryOut(CategoryBase):
    id: int
    user_id: int  # Include user_id in output

    class Config:
        orm_mode = True
