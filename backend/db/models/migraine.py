from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from db.db_setup import Base
from db.models.symptom import association_symptom
from db.models.trigger import association_trigger

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
    pain_map = Column(Integer, nullable=True) # ditto
    weather = Column(JSON, nullable=True)

    
    user = relationship("User", back_populates="migraines", cascade="all, delete")
    symptoms = relationship("SymptomOption", secondary=association_symptom, backref="migraines")
    triggers = relationship("TriggerOption", secondary=association_trigger, backref="migraines")