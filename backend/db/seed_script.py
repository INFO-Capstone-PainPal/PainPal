from sqlalchemy.orm import Session
from db.db_setup import SessionLocal
from db.models.symptom import SymptomOption
from db.models.trigger import TriggerOption

# Run "python seed_script.py" !
symptom_list = [
    
]

trigger_list = [

]

def seed_symptoms_and_triggers(db: Session):
    for name in symptom_list:
        exists = db.query(SymptomOption).filter_by(name=name).first()
        if not exists:
            db.add(SymptomOption(name=name))

    for name in trigger_list:
        exists = db.query(TriggerOption).filter_by(name=name).first()
        if not exists:
            db.add(TriggerOption(name=name))

    db.commit()
    print("Seeded symptom_options and trigger_options!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_symptoms_and_triggers(db)
    finally:
        db.close()
