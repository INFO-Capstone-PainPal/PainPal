from sqlalchemy import Column, Integer, ForeignKey, String, Table

from db.db_setup import Base

association_symptom = Table(
    "migraine_symptoms", Base.metadata,
    Column("migraine_id", ForeignKey("migraines.id"), primary_key=True),
    Column("symptom_option_id", ForeignKey("symptom_options.id"), primary_key=True)
)

class SymptomOption(Base):
    """
    Symptoms logged by user (linked to migraine table)
    """
    __tablename__ = "symptom_options"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)