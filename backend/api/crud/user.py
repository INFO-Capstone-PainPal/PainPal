from fastapi import HTTPException
from sqlalchemy.orm import Session
from db.models.user import User
from ..schemas.auth import UserUpdate
from utils.utils import get_password_hash

def update_user(db: Session, user_update: UserUpdate, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if 'password' in update_data:
        db_user.hashed_password = get_password_hash(update_data.pop('password'))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user) 
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()