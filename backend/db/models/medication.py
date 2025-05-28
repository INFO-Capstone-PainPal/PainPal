from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.db_setup import Base
from db.models.associations import association_medication

class MedicationOption(Base):
    """
    Medications logged by user (linked to migraine table)
    """
    __tablename__ = "medication_options"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    migraines = relationship("Migraine", secondary=association_medication, back_populates="medications")