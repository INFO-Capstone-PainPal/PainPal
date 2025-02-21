import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from api.crud import auth as crud_user
from api.schemas.token import Token
from jose import JWTError, jwt
from db.db_setup import get_db
from utils.utils import create_access_token, blacklist_token, oauth2_scheme
from api.crud.auth import authenticate_user

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}, 
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    print(f"Generated access token: {access_token}")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    # Blacklist the token
    blacklist_token(token, expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    print(f"Blacklisted token: {token}")
    return {"message": "Successfully logged out"}

@router.get("/validate_token")
async def validate_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"status": "valid"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")