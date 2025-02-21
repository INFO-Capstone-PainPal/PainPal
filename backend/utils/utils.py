from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
import os
import redis
from redis.exceptions import ConnectionError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.crud import auth
from api.schemas.auth import UserInDB
from api.schemas.token import TokenData
from db.db_setup import get_db

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Configure Redis client
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def blacklist_token(token: str, expires_in: int):
    try:
        redis_client.setex(token, expires_in, "blacklisted")
        print(f"Token {token} blacklisted for {expires_in} seconds")
    except ConnectionError:
        print("Could not connect to Redis. Token blacklisting failed.")

def is_token_blacklisted(token: str) -> bool:
    try:
        result = redis_client.get(token) == "blacklisted"
        print(f"Token {token} blacklisted: {result}")
        return result
    except ConnectionError:
        print("Could not connect to Redis. Assuming token is not blacklisted.")
        return False

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if is_token_blacklisted(token):
        raise credential_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credential_exception

    user = auth.get_user(db, username=token_data.username)
    if user is None:
        raise credential_exception

    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    return current_user