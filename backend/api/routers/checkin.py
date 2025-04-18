from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db_setup import get_db
from utils.utils import get_current_active_user
from db.models.user import User
from api.schemas.checkin import CheckInCreate, CheckIn
from api.crud import checkin as crud_checkin

router = APIRouter()

@router.post("/check-in", response_model=CheckIn)
def submit_checkin(data: CheckInCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return crud_checkin.create_checkin(db, user_id=current_user.id, checkin_data=data)