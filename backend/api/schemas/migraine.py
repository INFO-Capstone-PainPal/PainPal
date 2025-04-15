from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WeatherData(BaseModel):
    """
    Schema for weather data, including longitude and latitude.
    """
    temperature: float
    humidity: float
    description: str
    longitude: float
    latitude: float

class MigraineBase(BaseModel):
    """
    Base schema for Migraine data.
    """
    user_id: int
    pain_level: int
    pain_map: int
    weather: Optional[WeatherData] = None 

# schema for quick log
class MigraineQuickCreate(BaseModel):
    """
    Schema for creating a new Migraine entry.
    """
    start_time: datetime

class MigraineCompleteUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: datetime
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None

class MigraineCreate(MigraineBase):
    pass

class Migraine(MigraineBase):
    """
    Schema for returning Migraine data
    """
    id: int
    start_time: datetime
    end_time: datetime

    class Config:
        orm_mode = True