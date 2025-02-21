import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

def get_connection_uri():
    dbhost = os.environ['DBHOST']
    dbname = os.environ['DBNAME']
    dbuser = urllib.parse.quote(os.environ['DBUSER'])
    password = os.environ['DBPASSWORD']
    sslmode = os.environ['SSLMODE']
    db_uri = f"host={dbhost} dbname={dbname} user={dbuser} password={password} sslmode ={sslmode}"
    
    return db_uri

SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{urllib.parse.quote(os.environ['DBUSER'])}:"
    f"{urllib.parse.quote(os.environ['DBPASSWORD'])}@{os.environ['DBHOST']}/"
    f"{os.environ['DBNAME']}?sslmode={os.environ['SSLMODE']}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={}, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()