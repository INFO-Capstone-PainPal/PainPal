from datetime import date, timedelta
from db.models.checkin import CheckIn
from db.models.user import User
from api.schemas.checkin import CheckInCreate
from sqlalchemy.orm import Session

def create_checkin_with_streak(db: Session, user: User, checkin_data: CheckInCreate):
    today = date.today()

    # Check if already checked in today
    existing = db.query(CheckIn).filter_by(user_id=user.id, checkin_date=today).first()
    if existing:
        return existing

    # Determine if streak should increase or reset
    if user.last_checkin_date == today - timedelta(days=1):
        user.streak += 1
    else:
        user.streak = 1  # reset to 1 (today's check-in)

    user.last_checkin_date = today

    checkin = CheckIn(user_id=user.id, had_migraine=checkin_data.had_migraine, medications=checkin_data.medications)
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin
