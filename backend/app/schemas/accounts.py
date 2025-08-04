from pydantic import BaseModel


class AccountBase(BaseModel):
    name: str  # e.g., "Checking", "Savings", "Credit Card"


class AccountCreate(AccountBase):
    pass


class AccountOut(AccountBase):
    id: int
    user_id: int  # The owner user id

    class Config:
        orm_mode = True
