from sqlalchemy import Column, Integer, ForeignKey, Date, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from db.db_setup import Base

checkin_medications = Table(
    "checkin_medications",
    Base.metadata,
    Column("checkin_id", ForeignKey("checkins.id"), primary_key=True),
    Column("medication_option_id", ForeignKey("medication_options.id"), primary_key=True),
)

class CheckIn(Base):
    __tablename__ = "checkins"
    __table_args__ = (
        UniqueConstraint('user_id', 'date', name='uix_user_date'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False) 
    had_migraine = Column(Integer, nullable=False)  # 0 = no, 1 = yes

    medications = relationship("MedicationOption", secondary=checkin_medications, backref="checkins")
    user = relationship("User", back_populates="checkins")