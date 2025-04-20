from sqlalchemy import Table, Column, ForeignKey
from db.db_setup import Base

association_symptom = Table(
    "migraine_symptoms", Base.metadata,
    Column("migraine_id", ForeignKey("migraines.id"), primary_key=True),
    Column("symptom_option_id", ForeignKey("symptom_options.id"), primary_key=True)
)

association_trigger = Table(
    "migraine_triggers", Base.metadata,
    Column("migraine_id", ForeignKey("migraines.id"), primary_key=True),
    Column("trigger_option_id", ForeignKey("trigger_options.id"), primary_key=True)
)

association_medication = Table(
    "migraine_medications", Base.metadata,
    Column("migraine_id", ForeignKey("migraines.id"), primary_key=True),
    Column("medication_option_id", ForeignKey("medication_options.id"), primary_key=True)
)

checkin_medications = Table(
    "checkin_medications",
    Base.metadata,
    Column("checkin_id", ForeignKey("checkins.id"), primary_key=True),
    Column("medication_option_id", ForeignKey("medication_options.id"), primary_key=True),
)
