from pydantic import BaseModel

class MedicationOptionBase(BaseModel):
    name: str

class MedicationOptionCreate(MedicationOptionBase):
    pass

class MedicationOption(MedicationOptionBase):
    id: int

    class Config:
        orm_mode = True