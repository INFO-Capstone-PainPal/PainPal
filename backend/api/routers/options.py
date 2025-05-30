from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.db.db_setup import get_db
from backend.db.models.symptom import SymptomOption
from backend.db.models.trigger import TriggerOption
from backend.db.models.medication import MedicationOption

router = APIRouter(prefix="/options", tags=["options"])

@router.get("/")
def get_all_options(db: Session = Depends(get_db)):
    symptoms = db.query(SymptomOption).all()
    triggers = db.query(TriggerOption).all()
    medications = db.query(MedicationOption).all()

    return {
        "symptoms": symptoms,
        "triggers": triggers,
        "medications": medications
    }
