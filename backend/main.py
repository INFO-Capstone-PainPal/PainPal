from fastapi import FastAPI
import logging

from api.routers import users, auth, migraines
from db.db_setup import engine
from db.models import user, migraine

user.Base.metadata.create_all(bind=engine)
migraine.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PainPal",
    description="A mobile  app that helps users track and visualize chronic migraine pain along with " \
    "related health symptoms daily—without needing external medical records or hospital integration.",
    version="1.0.0"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.include_router(users.router, prefix="/users")
app.include_router(auth.router)
app.include_router(migraines.router, prefix="/migraines")