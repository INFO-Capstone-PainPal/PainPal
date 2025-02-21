from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.crud import auth as crud_auth
from api.crud import user as crud_user
from api.schemas.auth import User, UserCreate, UserUpdate
from db.db_setup import get_db
from utils.utils import get_current_active_user

router = APIRouter()

@router.post("/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud_auth.create_user(db=db, user_create=user)

@router.get("/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me/", response_model=User)
async def update_user_me(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    return crud_user.update_user(db=db, user_update=user_update, user_id=current_user.id)

@router.delete("/me/", response_model=dict)
async def delete_user_me(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    crud_user.delete_user(db=db, user_id=current_user.id)
    return {"message": "User deleted successfully"}