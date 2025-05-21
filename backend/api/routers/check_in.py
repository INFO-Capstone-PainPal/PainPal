from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db_setup import get_db
from utils.utils import get_current_active_user
from db.models.user import User
from api.schemas.check_in import CheckInCreate, CheckIn
from api.crud import check_in as crud_checkin
from utils.utils import get_current_active_user

router = APIRouter(prefix="/check-in")

@router.post("/", response_model=CheckIn)
def submit_checkin(data: CheckInCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return crud_checkin.create_checkin_with_streak(db, user=current_user, checkin_data=data)


@router.get("/streak")
def get_user_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    user = db.query(User).filter(User.id == current_user.id).first()

    return user.streak