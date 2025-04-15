from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from db.db_setup import Base

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
    
    user = relationship("User", back_populates="migraines")