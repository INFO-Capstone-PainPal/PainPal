import pandas as pd
from sqlalchemy.orm import Session
from db.models.migraine import Migraine
from db.models.trigger import TriggerOption

def get_migraine_dataframe_for_user(db: Session, user_id: int) -> pd.DataFrame:
    migraines = db.query(Migraine).filter(Migraine.user_id == user_id).all()
    all_triggers = [t.name for t in db.query(TriggerOption).all()]

    data = []
    for m in migraines:
        row = {
            "start_time": m.start_time.isoformat(),
            "end_time": m.end_time.isoformat() if m.end_time else None,
            "pain_level": m.pain_level,
            "duration_hours": (
                (m.end_time - m.start_time).total_seconds() / 3600
                if m.end_time else None
            ),
            "num_symptoms": len(m.symptoms),
            "num_medications": len(m.medications),
        }

        # Weather data
        weather = m.weather or {}
        row["Temperature"] = weather.get("temperature")
        row["Pressure"] = weather.get("pressure")

        # One-hot encode all possible triggers
        migraine_triggers = {t.name for t in m.triggers}
        for trigger in all_triggers:
            row[trigger] = int(trigger in migraine_triggers)

        data.append(row)

    return pd.DataFrame(data)