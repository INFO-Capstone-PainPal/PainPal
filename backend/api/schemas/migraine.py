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

class MigraineCreate(MigraineBase):
    """
    Schema for creating a new Migraine entry.
    """
    pass

class Migraine(MigraineBase):
    """
    Schema for returning Migraine data (includes ID and timestamp).
    """
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True