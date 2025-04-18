from sqlalchemy import Column, Integer, ForeignKey, String, Table

from db.db_setup import Base

association_trigger = Table(
    "migraine_triggers", Base.metadata,
    Column("migraine_id", ForeignKey("migraines.id"), primary_key=True),
    Column("trigger_option_id", ForeignKey("trigger_options.id"), primary_key=True)
)

class TriggerOption(Base):
    """
    Triggers logged by user (linked to migraine table)
    """
    __tablename__ = "trigger_options"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)