from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from db.models.symptom import SymptomOption
from db.models.trigger import TriggerOption
from db.models.medication import MedicationOption
from db.models.migraine import Migraine
from api.schemas.migraine import MigraineCreate, MigraineCompleteUpdate

def create_migraine_log(db: Session, migraine: MigraineCreate, user_id: int):
    db_migraine = Migraine(**migraine.model_dump(exclude={"symptoms", "triggers", "medications"}), user_id=user_id)

    if migraine.symptom_option_ids:
        db_migraine.symptoms = db.query(SymptomOption).filter(SymptomOption.id.in_(migraine.symptom_option_ids)).all()
    if migraine.trigger_option_ids:
        db_migraine.triggers = db.query(TriggerOption).filter(TriggerOption.id.in_(migraine.trigger_option_ids)).all()
    if migraine.medication_option_ids:
        db_migraine.medications = db.query(MedicationOption).filter(MedicationOption.id.in_(migraine.medication_option_ids)).all()

    db.add(db_migraine)
    db.commit()
    db.refresh(db_migraine)
    return db_migraine

def get_migraine_from_user(db: Session, migraine_id: int, user_id: int):
    return db.query(Migraine).filter(Migraine.id == migraine_id, Migraine.user_id == user_id).first()


def get_migraines_for_month(db: Session, user_id: int, year: int, month: int):
    start_of_month = datetime(year, month, 1)
    start_date = start_of_month - timedelta(days=7)

    if month == 12:
        end_of_month = datetime(year + 1, 1, 1)
    else:
        end_of_month = datetime(year, month + 1, 1)
    
    end_date = end_of_month + timedelta(days=7)

    return db.query(Migraine).filter(
        Migraine.user_id == user_id,
        Migraine.start_time >= start_date,
        Migraine.start_time < end_date
    ).order_by(Migraine.start_time).all()

def quick_create_migraine(db: Session, user_id: int, start_time: datetime):
    migraine = Migraine(user_id=user_id, start_time=start_time)
    db.add(migraine)
    db.commit()
    db.refresh(migraine)
    return migraine

def complete_migraine_log(db: Session, user_id: int, migraine_id: int, update_data: MigraineCompleteUpdate):
    migraine = db.query(Migraine).filter(Migraine.id == migraine_id, Migraine.user_id == user_id).first()
    if not migraine:
        return None

    if update_data.symptoms is not None:
        migraine.symptoms = db.query(SymptomOption).filter(SymptomOption.id.in_(update_data.symptoms)).all()

    if update_data.triggers is not None:
        migraine.triggers = db.query(TriggerOption).filter(TriggerOption.id.in_(update_data.triggers)).all()

    if update_data.medications is not None:
        migraine.medications = db.query(MedicationOption).filter(MedicationOption.id.in_(update_data.medications)).all()

    # For all other fields that are scalar (e.g. int, str, datetime), use setattr safely:
    for field, value in update_data.model_dump(exclude={"symptoms", "triggers", "medications"}).items():
        if value is not None:
            setattr(migraine, field, value)

    db.commit()
    db.refresh(migraine)
    return migraine