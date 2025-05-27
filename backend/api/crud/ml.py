import pandas as pd
from sqlalchemy.orm import Session

from backend.db.models.checkin import CheckIn
from backend.db.models.migraine import Migraine
from backend.db.models.trigger import TriggerOption

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

def get_combined_migraine_checkin_data(db: Session, user_id: int) -> pd.DataFrame:
    # Step 1: Get migraines
    migraines = (
        db.query(Migraine)
        .filter(Migraine.user_id == user_id)
        .all()
    )

    migraine_data = []
    for m in migraines:
        migraine_data.append({
            "migraine_id": m.id,
            "start_time": m.start_time,
            "pain_level": m.pain_level,
            "weather": m.weather,
            "date": m.start_time.date(),  # simplify
        })

    migraine_df = pd.DataFrame(migraine_data)

    # Step 2: Get check-ins
    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_id == user_id)
        .all()
    )

    checkin_data = []
    for c in checkins:
        checkin_data.append({
            "checkin_date": c.checkin_date,
            "total_sleep_hours": c.total_sleep_hours,
            "weather_checkin": c.weather,
        })

    checkin_df = pd.DataFrame(checkin_data)

    # Step 3: Merge on closest matching date
    df = pd.merge(migraine_df, checkin_df, left_on="date", right_on="checkin_date", how="left")

    # Add binary indicator for migraine presence
    df["had_migraine"] = df["migraine_id"].notnull().astype(int)

    return df

