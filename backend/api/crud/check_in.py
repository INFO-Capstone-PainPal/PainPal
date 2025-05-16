from sqlalchemy.orm import Session

from datetime import date, timedelta
from db.models.checkin import CheckIn
from db.models.user import User
from api.schemas.check_in import CheckInCreate
from db.models.medication import MedicationOption
from utils.utils import calculate_sleep_hours

def create_checkin_with_streak(db: Session, user: User, checkin_data: CheckInCreate):
    checkin_date = date.today()

    # Check if already checked in today (prevent duplicates)
    existing = db.query(CheckIn).filter_by(user_id=user.id, checkin_date=checkin_date).first()
    if existing:
        return existing

    # Determine if streak should increase or reset
    if user.last_checkin_date == checkin_date - timedelta(days=1):
        user.streak += 1
    else:
        user.streak = 1  # reset to 1 (today's check-in)

    user.last_checkin_date = checkin_date

    # Resolve medication objects
    if checkin_data.medications:
        medication_objs = db.query(MedicationOption).filter(MedicationOption.id.in_(checkin_data.medications)).all()
    else:
        medication_objs = []

    # Calculate sleep hours
    sleep_hours = None
    if checkin_data.time_went_to_bed and checkin_data.time_woke_up:
        sleep_hours = calculate_sleep_hours(
            checkin_data.time_went_to_bed,
            checkin_data.time_woke_up
        )

    # Create checkin record
    checkin = CheckIn(
        user_id=user.id,
        had_migraine=checkin_data.had_migraine,
        checkin_date=checkin_date,
        medications=medication_objs,
        time_went_to_bed=checkin_data.time_went_to_bed,
        time_woke_up=checkin_data.time_woke_up,
        total_sleep_hours=sleep_hours
    )

    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin