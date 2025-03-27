from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from db.db_setup import Base

class Migraines(Base):
    """
    Migraines logged by user
    """
    __tablename__ = "migraines"

    id = Column(Integer, primary_key=True, index=True)
    userid = Column(Integer, ForeignKey("users.id"), nullable=False)
    pain_level = Column(Integer, nullable=False)
    pain_map = Column(Integer, nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False) # first click = initial time, second click = migraine end but you can change when it ends manually if needed
    weather = Column(JSON, nulluable = True)
    
    user = relationship("User", back_populates="migraines")