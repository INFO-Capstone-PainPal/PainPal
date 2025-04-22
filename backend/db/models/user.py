from sqlalchemy import Column, Integer, String, Date
from sqlalchemy_utils import EmailType
from sqlalchemy.orm import relationship

from db.db_setup import Base
from db.models.checkin import CheckIn

class User(Base):
    """
    User profile
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(64))
    email = Column(EmailType, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    last_checkin_date = Column(Date, nullable=True)

    migraines = relationship("Migraine", back_populates="user", cascade="all, delete-orphan")
    checkins = relationship("CheckIn", back_populates="user", cascade="all, delete-orphan")