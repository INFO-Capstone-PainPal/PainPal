import pandas as pd
from sqlalchemy.orm import Session
from db.models.checkin import CheckIn
from db.models.trigger import TriggerOption

def get_all_trigger_names(db: Session) -> list[str]:
    return [t.name for t in db.query(TriggerOption).all()]

def get_checkin_dataframe_for_user(db: Session, user_id: int) -> pd.DataFrame:
    checkins = db.query(CheckIn).filter(CheckIn.user_id == user_id).all()
    all_triggers = get_all_trigger_names(db)

    data = []
    for c in checkins:
        weather_data = c.weather or {}

        row = {
            "Total_sleep": c.total_sleep_hours,
            "Bedtime": c.time_went_to_bed.isoformat() if c.time_went_to_bed else None,
            "Wake_time": c.time_woke_up.isoformat() if c.time_woke_up else None,
            "Temperature": weather_data.get("temperature"),
            "Pressure": weather_data.get("pressure"),
            "Migraine": c.had_migraine,
            "date": c.checkin_date.isoformat(),
             "Preventative_medication": int(len(c.medications) > 0)
        }

        # Add trigger flags from the TriggerOption relationship
        checkin_trigger_names = {t.name for t in c.triggers}
        for trigger_name in all_triggers:
            row[trigger_name] = int(trigger_name in checkin_trigger_names)

        data.append(row)

    return pd.DataFrame(data)
