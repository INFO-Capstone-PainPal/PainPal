import pandas as pd
from datetime import datetime

from sqlalchemy.orm import Session

from db.db_setup import SessionLocal
from db.models.migraine import Migraine
from db.models.medication import MedicationOption
from db.models.trigger import TriggerOption

def seed_migraines_for_user(user_id: int, filepath: str = "xxx"):
    db: Session = SessionLocal()
    df = pd.read_csv(filepath)

    all_meds = db.query(MedicationOption).all()
    all_triggers = db.query(TriggerOption).all()

    for _, row in df.iterrows():
        migraine = Migraine(
            user_id=user_id,
            start_time=datetime.strptime(row["date"], "%Y-%m-%d"),
            weather={
                "Temperature": row["Temperature"],
                "Pressure": row["Pressure"]
            },
        )

        # Attach medication if marked
        if row.get("Preventative_medication", 0) == 1 and all_meds:
            migraine.medications = [all_meds[0]]  # You can randomize or expand if needed

        # Attach triggers based on binary columns
        active_triggers = [
            t for t in ["Stress", "Skipped_meal", "Chocolate"]
            if row.get(t, 0) == 1
        ]
        migraine.triggers = [
            t for t in all_triggers if t.name in active_triggers
        ]

        db.add(migraine)

    db.commit()
    db.close()

if __name__ == "__main__":
    # Replace with your test user’s ID
    test_user_id = 19
    seed_migraines_for_user(user_id=test_user_id)