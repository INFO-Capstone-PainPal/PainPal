from sqlalchemy.orm import Session
from datetime import datetime

from backend.db.models.migraine import Migraine
from api.schemas.migraine import MigraineCreate, MigraineCompleteUpdate
from typing import Optional

def create_migraine_log(db: Session, migraine: MigraineCreate, user_id: int):
    db_migraine = Migraine(**migraine.model_dump*(), user_id=user_id)
    db.add(db_migraine)
    db.commit()
    db.refresh(db_migraine)
    return db_migraine

def get_migraine_from_user(db: Session, migraine_id: int, user_id: int):
    migraine = db.query(Migraine).filter(Migraine.id == migraine_id, Migraine.user_id == user_id).first()
    return migraine

def get_migraines_for_month(db: Session, user_id: int, year: int, month: int):
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1)
    else:
        end_date = datetime(year, month + 1, 1)

    return db.query(Migraine).filter(Migraine.user_id == user_id, Migraine.timestamp >= start_date, Migraine.timestamp < end_date).order_by(Migraine.timestamp).all()

def quick_create_migraine(db: Session, user_id: int, timestamp: Optional[datetime] = None):
    migraine = Migraine(user_id=user_id, timestamp=timestamp or datetime.now())
    db.add(migraine)
    db.commit()
    db.refresh(migraine)
    return migraine

def complete_migraine_log(db: Session, user_id: int, migraine_id: int, update_data: MigraineCompleteUpdate):
    migraine = db.query(Migraine).filter(Migraine.id == migraine_id, Migraine.user_id == user_id).first()

    if not migraine:
        return None
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(migraine, field, value)

    db.commit()
    db.refresh(migraine)
    return migraine