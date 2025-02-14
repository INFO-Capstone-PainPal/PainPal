import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

def get_connection_uri():
    dbhost = os.environ['DBHOST']
    dbname = os.environ['DBNAME']
    dbuser = urllib.parse.quote(os.environ['DBUSER'])
    password = os.environ['DBPASSWORD']
    sslmode = os.environ['SSLMODE']
    db_uri = f"host={dbhost} dbname={dbname} user={dbuser} password={password} sslmode ={sslmode}"
    
    return db_uri