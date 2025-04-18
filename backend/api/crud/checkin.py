from sqlalchemy.orm import Session
from db.models.checkin import CheckIn
from db.models.medication import MedicationOption
from api.schemas.checkin import CheckInCreate

def create_checkin(db: Session, user_id: int, checkin_data: CheckInCreate):
    checkin = CheckIn(
        user_id=user_id,
        date=checkin_data.date,
        had_migraine=checkin_data.had_migraine
    )

    # attach medication relationships
    if checkin_data.medications:
        meds = db.query(MedicationOption).filter(MedicationOption.id.in_(checkin_data.medications)).all()
        checkin.medications = meds

    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin
