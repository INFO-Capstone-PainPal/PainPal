from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from api.schemas.symptom import SymptomOption 
from api.schemas.trigger import TriggerOption
from api.schemas.medication import MedicationOption

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    description: str
    longitude: float
    latitude: float
    pressure: float

# Schema for quick log
class MigraineQuickCreate(BaseModel):
    start_time: datetime
    weather: WeatherData

class MigraineCompleteUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: datetime
    pain_level: Optional[int] = None
    pain_map: Optional[List[int]] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[int]] = None 
    triggers: Optional[List[int]] = None
    medications: Optional[List[int]] = None

class MigraineCreate(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    pain_level: Optional[int] = None
    pain_map: Optional[List[int]] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[int]] = None
    triggers: Optional[List[int]] = None

class Migraine(BaseModel):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    pain_level: Optional[int] = None
    pain_map: Optional[List[int]] = None
    weather: Optional[WeatherData] = None
    symptoms: Optional[List[SymptomOption]] = None
    triggers: Optional[List[TriggerOption]] = None
    medications: Optional[List[MedicationOption]] = None

    class Config:
        orm_mode = True