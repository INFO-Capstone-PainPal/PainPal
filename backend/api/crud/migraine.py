from sqlalchemy.orm import Session
from datetime import datetime

from api.schemas.migraine import MigraineCreate, MigraineCompleteUpdate

from db.models.symptom import SymptomOption
from db.models.trigger import TriggerOption
from db.models.medication import MedicationOption
from db.models.migraine import Migraine

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
    start_date = datetime(year, month, 1)
    end_date = datetime(year + int(month == 12), (month % 12) + 1, 1)

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

    # Update scalar fields like start_time, end_time, pain_level, etc.
    for field, value in update_data.model_dump(exclude_unset=True, exclude={"symptoms", "triggers", "medications"}).items():
        setattr(migraine, field, value)

    # Update relationships
    if update_data.symptoms is not None:
        migraine.symptoms = db.query(SymptomOption).filter(SymptomOption.id.in_(update_data.symptoms)).all()

    if update_data.triggers is not None:
        migraine.triggers = db.query(TriggerOption).filter(TriggerOption.id.in_(update_data.triggers)).all()

    if update_data.medications is not None:
        migraine.medications = db.query(MedicationOption).filter(MedicationOption.id.in_(update_data.medications)).all()

    db.commit()
    db.refresh(migraine)
    return migraine
