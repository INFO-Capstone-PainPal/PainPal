from sqlalchemy import Column, Integer, ForeignKey, Date, UniqueConstraint, Float, JSON, Time
from sqlalchemy.orm import relationship
from datetime import date

from backend.db.db_setup import Base
from backend.db.models.associations import checkin_medications

class CheckIn(Base):
    __tablename__ = "checkins"
    __table_args__ = (
        UniqueConstraint('user_id', 'checkin_date', name='uix_user_date'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    checkin_date = Column(Date, nullable=False, default=date.today)
    had_migraine = Column(Integer, nullable=False)  # 0 = no, 1 = yes
    time_went_to_bed = Column(Time, nullable=False)
    time_woke_up = Column(Time, nullable=False)
    total_sleep_hours = Column(Float, nullable=True) # this is calculated
    weather = Column(JSON, nullable=False)

    medications = relationship("MedicationOption", secondary=checkin_medications, backref="checkins")
    user = relationship("User", back_populates="checkins")