from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from api.schemas.symptom import SymptomOption 
from api.schemas.trigger import TriggerOption

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    description: str
    longitude: float
    latitude: float

# Schema for quick log
class MigraineQuickCreate(BaseModel):
    start_time: datetime

class MigraineCompleteUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: datetime
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[int]] = None 
    triggers: Optional[List[int]] = None

class MigraineCreate(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[int]] = None
    triggers: Optional[List[int]] = None

class Migraine(BaseModel):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    pain_level: Optional[int] = None
    pain_map: Optional[int] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[SymptomOption]] = None
    triggers: Optional[List[TriggerOption]] = None 

    class Config:
        orm_mode = True