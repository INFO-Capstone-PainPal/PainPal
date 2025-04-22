<<<<<<< Updated upstream
from sqlalchemy.orm import Session

from datetime import date, timedelta
from db.models.checkin import CheckIn
from db.models.user import User
from api.schemas.check_in import CheckInCreate
from db.models.medication import MedicationOption

def create_checkin_with_streak(db: Session, user: User, checkin_data: CheckInCreate):
    checkin_date = date.today()

    # Check if already checked in today
    existing = db.query(CheckIn).filter_by(user_id=user.id, checkin_date=checkin_date).first()
=======
from datetime import date, timedelta
from db.models.checkin import CheckIn
from db.models.user import User
from backend.api.schemas.check_in import CheckInCreate
from sqlalchemy.orm import Session

def create_checkin_with_streak(db: Session, user: User, checkin_data: CheckInCreate):
    today = date.today()

    # Check if already checked in today
    existing = db.query(CheckIn).filter_by(user_id=user.id, checkin_date=today).first()
>>>>>>> Stashed changes
    if existing:
        return existing

    # Determine if streak should increase or reset
<<<<<<< Updated upstream
    if user.last_checkin_date == checkin_date - timedelta(days=1):
=======
    if user.last_checkin_date == today - timedelta(days=1):
>>>>>>> Stashed changes
        user.streak += 1
    else:
        user.streak = 1  # reset to 1 (today's check-in)

<<<<<<< Updated upstream
    user.last_checkin_date = checkin_date

    if checkin_data.medications:
        medication_objs = db.query(MedicationOption).filter(MedicationOption.id.in_(checkin_data.medications)).all()
    else:
        medication_objs = []

    checkin = CheckIn(
        user_id=user.id,
        had_migraine=checkin_data.had_migraine,
        checkin_date=checkin_date,
        medications=medication_objs
    )

=======
    user.last_checkin_date = today

    checkin = CheckIn(user_id=user.id, had_migraine=checkin_data.had_migraine, medications=checkin_data.medications)
>>>>>>> Stashed changes
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin
