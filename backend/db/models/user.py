from sqlalchemy import Column, Integer, String
from sqlalchemy_utils import EmailType
from sqlalchemy.orm import relationship

from db.db_setup import Base

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

    migraines = relationship("Migraine", back_populates="user", cascade="all, delete-orphan")