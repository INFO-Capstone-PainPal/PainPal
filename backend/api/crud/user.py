from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from backend.db.models.user import User
from ..schemas.auth import UserUpdate
from backend.utils.utils import get_password_hash

def update_user(db: Session, user_update: UserUpdate, user_id: int):
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    update_data = user_update.dict(exclude_unset=True)

    # Check and update email
    if "email" in update_data:
        existing_user = db.query(User).filter(
            User.email == update_data["email"],
            User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email is already in use.")
        user.email = update_data["email"]

    # Check and update password
    if "password" in update_data:
        user.hashed_password = get_password_hash(update_data["password"])

    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed: Integrity error.")

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()