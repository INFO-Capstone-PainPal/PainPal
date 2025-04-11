from fastapi import FastAPI
import logging

from api.routers import users, auth, migraine
from backend.db.models import migraine
from db.db_setup import engine
from db.models import user

user.Base.metadata.create_all(bind=engine)
migraine.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AU24: INFO 442 Team Pesto",
    description="Postpartum Depression Web App",
    version="1.0.0"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.include_router(users.router, prefix="/users")
app.include_router(auth.router)
app.include_router(migraine.router, prefix="/migraines")