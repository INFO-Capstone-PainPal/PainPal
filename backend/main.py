from fastapi import FastAPI
import logging

from api.routers import users, auth, migraines, check_in, options
from db.models import *

app = FastAPI(
    title="PainPal",
    description="A mobile  app that helps users track and visualize chronic migraine pain along with " \
    "related health symptoms daily—without needing external medical records or hospital integration.",
    version="1.0.0"
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(migraines.router)
app.include_router(check_in.router)
app.include_router(options.router)