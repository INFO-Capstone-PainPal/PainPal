from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    """
    Base schema for Migraine data
    """
    username: str
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    """
    Schema for creating a new user
    """
    password: str

class UserUpdate(BaseModel):
    """
    Schema for updating stored information for a user
    """
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password: str