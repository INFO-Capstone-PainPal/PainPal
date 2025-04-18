from pydantic import BaseModel
from datetime import date
from typing import List

class CheckInCreate(BaseModel):
    date: date
    had_migraine: int  # 0 or 1
    medications: List[int]  # List of medication option IDs

class CheckIn(BaseModel):
    id: int
    user_id: int
    date: date
    had_migraine: int
    medications: List[int]

    class Config:
        orm_mode = True