from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON, ARRAY
from sqlalchemy.orm import relationship

from db.db_setup import Base
from db.models.associations import association_symptom, association_medication, association_trigger

class Migraine(Base):
    """
    Migraines logged by user
    """
    __tablename__ = "migraines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    pain_level = Column(Integer, nullable=True) # allow it to be missing for quick logging
    pain_map = Column(ARRAY(Integer), nullable=True) # ditto
    weather = Column(JSON, nullable=True)

    user = relationship("User", back_populates="migraines", cascade="all, delete")
    symptoms = relationship("SymptomOption", secondary=association_symptom, back_populates="migraines")
    triggers = relationship("TriggerOption", secondary=association_trigger, back_populates="migraines")
    medications = relationship("MedicationOption", secondary=association_medication, back_populates="migraines")
