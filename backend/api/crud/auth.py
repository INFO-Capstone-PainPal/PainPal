import logging as logger

from sqlalchemy.orm import Session

from db.models.user import User
from ..schemas.auth import UserCreate
from utils.utils import get_password_hash, verify_password

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user_create: UserCreate):
    db_user = User(
        username=user_create.username,
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=get_password_hash(user_create.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        logger.error(f"User {username} not found")
        return False
    if not verify_password(password, user.hashed_password):
        logger.error(f"Password for user {username} is incorrect")
        return False
    logger.info(f"User {username} authenticated successfully")
    return user