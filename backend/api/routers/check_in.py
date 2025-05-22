from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from db.db_setup import get_db
from utils.utils import get_current_active_user
from db.models.user import User
from api.schemas.check_in import CheckInCreate, CheckIn as CheckInSchema
from db.models.checkin import CheckIn
from api.crud import check_in as crud_checkin

router = APIRouter(prefix="/check-in")

@router.post("/", response_model=CheckInSchema)
def submit_checkin(
    data: CheckInCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud_checkin.create_checkin_with_streak(db, user=current_user, checkin_data=data)

@router.get("/streak")
def get_user_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return current_user.streak

@router.get("/checkin/today")
def has_checked_in_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    today = date.today()
    checkin = db.query(CheckIn).filter(
        CheckIn.user_id == current_user.id,
        CheckIn.checkin_date == today
    ).first()

    return {
        "has_checked_in": bool(checkin),
        "checkin_id": checkin.id if checkin else None,
    }
