import pandas as pd
from sqlalchemy.orm import Session
from collections import defaultdict

from backend.db.models.checkin import CheckIn
from backend.db.models.migraine import Migraine


def construct_ml_dataframe(db, user_id: int):
    # Fetch all relevant data
    checkins = db.query(CheckIn).filter(CheckIn.user_id == user_id).all()
    migraines = db.query(Migraine).filter(Migraine.user_id == user_id).all()

    # Group migraines by date
    migraines_by_date = defaultdict(list)
    for migraine in migraines:
        if migraine.start_time:
            migraine_date = migraine.start_time.date().strftime('%Y-%m-%d')
            migraines_by_date[migraine_date].append(migraine)

    data = []

    for checkin in checkins:
        checkin_date_str = checkin.checkin_date.strftime('%Y-%m-%d')

        # Weather fields from JSON
        weather = checkin.weather or {}
        temperature = weather.get("temperature")
        pressure = weather.get("pressure")

        # Preventative medication flag
        took_medications = 1 if checkin.medications else 0

        # Trigger keywords mapping to model columns
        trigger_names = {trigger.name.lower() for migraine in migraines_by_date.get(checkin_date_str, []) for trigger in migraine.triggers}

        # Feature extraction
        row = {
            "Total_sleep": checkin.total_sleep_hours,
            "Bedtime": checkin.time_went_to_bed.hour + checkin.time_went_to_bed.minute / 60.0 if checkin.time_went_to_bed else None,
            "Wake_time": checkin.time_woke_up.hour + checkin.time_woke_up.minute / 60.0 if checkin.time_woke_up else None,
            "Temperature": temperature,
            "Pressure": pressure,
            "Preventative_medication": took_medications,
            "Processed_food": 1 if "processed food" in trigger_names else 0,
            "Skipped_meal": 1 if "skipped meal" in trigger_names else 0,
            "Alcohol": 1 if "alcohol" in trigger_names else 0,
            "Cheese": 1 if "cheese" in trigger_names else 0,
            "Chocolate": 1 if "chocolate" in trigger_names else 0,
            "Dehydration": 1 if "dehydration" in trigger_names else 0,
            "Interrupted_sleep": 1 if "interrupted sleep" in trigger_names else 0,
            "Congestion": 1 if "congestion" in trigger_names else 0,
            "Hangover": 1 if "hangover" in trigger_names else 0,
            "Stress": 1 if "stress" in trigger_names else 0,
            "Depressed": 1 if "depressed" in trigger_names else 0,
            "Low_blood_sugar": 1 if "low blood sugar" in trigger_names else 0,
            "Migraine": 1 if migraines_by_date.get(checkin_date_str) else 0,
            "date": checkin_date_str
        }

        data.append(row)

    df = pd.DataFrame(data)
    return df

