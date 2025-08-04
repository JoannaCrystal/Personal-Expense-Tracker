from pydantic import BaseModel, EmailStr, constr, validator

class UserCreate(BaseModel):
    first_name: constr(strip_whitespace=True, min_length=1)
    last_name: constr(strip_whitespace=True, min_length=1)
    username: constr(strip_whitespace=True, min_length=3, max_length=30)
    email: EmailStr
    password: constr(min_length=6)

    @validator('username')
    def username_no_spaces(cls, v):
        if ' ' in v:
            raise ValueError('Username must not contain spaces')
        return v

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr

    class Config:
        orm_mode = True
