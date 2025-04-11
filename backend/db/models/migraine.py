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
    pain_level = Column(Integer, nullable=True) # allow it to be missing for quick logging
    pain_map = Column(Integer, nullable=True) # ditto
    timestamp = Column(DateTime, server_default=func.now(), nullable=False) # first click = initial time, second click = migraine end but you can change when it ends manually if needed
    weather = Column(JSON, nullable=True)
    
    user = relationship("User", back_populates="migraines")