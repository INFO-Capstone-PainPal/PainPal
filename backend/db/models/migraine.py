from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from db.db_setup import Base

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream:backend/db/models/migraines.py
class Migraines(Base):
    """
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
class Migraine(Base):
    """ 
>>>>>>> Stashed changes:backend/db/models/migraine.py
    Migraines logged by user
    """
    __tablename__ = "migraines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pain_level = Column(Integer, nullable=False)
    pain_map = Column(Integer, nullable=False)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False) # first click = initial time, second click = migraine end but you can change when it ends manually if needed
    
    user = relationship("User", back_populates="migraines")