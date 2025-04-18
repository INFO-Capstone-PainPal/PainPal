import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

from sqlalchemy.orm import Session
from db_setup import SessionLocal
from models.symptom import SymptomOption
from models.trigger import TriggerOption
from models.medication import MedicationOption

# Run "python seed_script.py" !
symptom_list = [
    "Trouble Walking", "Blurred Vision", "Ear Ringing",
    "Smell Sensitivity", "Sound Sensitivity", "Light Sensitivity",
    "Insomnia", "Nausea", "Vomiting",
    "Depressed", "Anxious", "Fatigue",
    "Difficulty Concentrating", "Temperature Sensitivity", "Stomach Pain"
    ]

trigger_list = [
    "Processed Foods", "Skipped Meals", "Alcohol",
    "Cheese", "Chocolate", "Dehydration",
    "Interrupted Sleep", "Sinus or Congestion", "Missed Preventative Meds",
    "Allergies", "Fever", "Hangover",
    "Menstrual Cycle", "Post-Trauma", "Depressed",
    "Weather", "Stress", "Low Blood Sugar"
]

medication_list = [
    "Sumatriptan", "Ubrelvy", "Imitrex",
    "Nurtec ODT", "Rizatriptan", "Memantine",
    "OnabotulinumtoxinA", "Rimegepant", "Ubrogepant",
    "Atogepant", "Eptinezumab", "Erenumab",
    "Maxalt", "Gabapentin", "Relpax",
    "Excedrin", "Treximet", "Zomig"
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
    
    for name in medication_list:
        exists = db.query(MedicationOption).filter_by(name=name).first()
        if not exists:
            db.add(MedicationOption(name=name))

    db.commit()
    print("Seeded symptom_options and trigger_options!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_symptoms_and_triggers(db)
    finally:
        db.close()
