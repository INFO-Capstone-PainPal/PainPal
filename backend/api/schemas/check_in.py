from pydantic import BaseModel
from typing import List, Optional
from datetime import time

class CheckInCreate(BaseModel):
    had_migraine: int  # 0 or 1
    medications: List[int]  # List of medication option IDs
    time_went_to_bed: time
    time_woke_up: time

class CheckIn(BaseModel):
    id: int
    user_id: int
    had_migraine: int
    medications: Optional[List[int]]
    time_went_to_bed: time
    time_woke_up: time
    total_sleep_time: Optional[float]

    class Config:
        orm_mode = True