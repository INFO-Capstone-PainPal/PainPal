from pydantic import BaseModel

class SymptomOptionBase(BaseModel):
    name: str

class SymptomOptionCreate(SymptomOptionBase):
    pass

class SymptomOption(SymptomOptionBase):
    id: int

    class Config:
        orm_mode = True
