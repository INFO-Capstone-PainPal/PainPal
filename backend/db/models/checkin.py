from sqlalchemy import Column, Integer, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import relationship
<<<<<<< Updated upstream
from datetime import date

from db.db_setup import Base
from db.models.associations import checkin_medications
=======

from db.models.associations import checkin_medications
from db.db_setup import Base
>>>>>>> Stashed changes

class CheckIn(Base):
    __tablename__ = "checkins"
    __table_args__ = (
        UniqueConstraint('user_id', 'checkin_date', name='uix_user_date'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    checkin_date = Column(Date, nullable=False, default=date.today)
    had_migraine = Column(Integer, nullable=False)  # 0 = no, 1 = yes

    medications = relationship("MedicationOption", secondary=checkin_medications, backref="checkins")
    user = relationship("User", back_populates="checkins")