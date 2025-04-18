from pydantic import BaseModel

class TriggerOptionBase(BaseModel):
    name: str

class TriggerOptionCreate(TriggerOptionBase):
    pass

class TriggerOption(TriggerOptionBase):
    id: int

    class Config:
        orm_mode = True
