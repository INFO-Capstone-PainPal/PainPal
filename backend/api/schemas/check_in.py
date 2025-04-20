from pydantic import BaseModel
from typing import List, Optional

class CheckInCreate(BaseModel):
    had_migraine: int  # 0 or 1
    medications: List[int]  # List of medication option IDs

class CheckIn(BaseModel):
    id: int
    user_id: int
    had_migraine: int
    medications: Optional[List[int]]

    class Config:
        orm_mode = True