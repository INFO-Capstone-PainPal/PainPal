from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from db.db_setup import Base
from db.models.associations import association_trigger

class TriggerOption(Base):
    """
    Triggers logged by user (linked to migraine table)
    """
    __tablename__ = "trigger_options"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    migraines = relationship("Migraine", secondary=association_trigger, back_populates="triggers")