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
    userid: int
    pain_level: int
    pain_map: int
    weather: Optional[WeatherData] = None 

# schema for quick log
class MigraineQuickCreate(BaseModel):
    """
    Schema for creating a new Migraine entry.
    """
    timestamp: Optional[datetime] = None

class MigraineCompleteUpdate(BaseModel):
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None

class MigraineCompleteUpdate(BaseModel):
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None

class MigraineCreate(MigraineBase):
    pass

class Migraine(MigraineBase):
    """
    Schema for returning Migraine data (includes ID and timestamp).
    """
    id: int
    userid: int
    timestamp: datetime
    pain_level: Optional[int]
    pain_map: Optional[int]
    weather: Optional[WeatherData]

    class Config:
        orm_mode = True