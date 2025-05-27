from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from sqlalchemy.orm import Session

from backend.api.crud import migraine as crud_migraine
from backend.api.schemas.migraine import Migraine, MigraineCompleteUpdate, MigraineQuickCreate
from backend.db.models.user import User
from backend.db.db_setup import get_db
from backend.utils.utils import get_current_active_user

router = APIRouter(prefix="/migraines")

# Quick log router
@router.post("/quick-log", response_model=Migraine)
def quick_log_migraine(entry: MigraineQuickCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    quick_migraine = crud_migraine.quick_create_migraine(
        db=db,
        user_id=current_user.id,
        start_time=entry.start_time
    )
    return quick_migraine

# Update log after quick logging or edits
@router.put("/{migraine_id}/complete", response_model=Migraine)
def update_migraine_entry(
    migraine_id: int,
    update: MigraineCompleteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    migraine = crud_migraine.complete_migraine_log(
        db=db,
        user_id=current_user.id,
        migraine_id=migraine_id,
        update_data=update
    )
    if migraine is None:
        raise HTTPException(status_code=404, detail="Migraine log not found")
    return migraine

# Get all migraines for given month
@router.get("/month", response_model=list[Migraine])
def get_migraines_by_month(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud_migraine.get_migraines_for_month(
        db=db,
        user_id=current_user.id,
        year=year,
        month=month
    )

# Get a single migraine log
@router.get("/{migraine_id}", response_model=Migraine)
def read_migraine(
    migraine_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_migraine = crud_migraine.get_migraine_from_user(
        db=db,
        migraine_id=migraine_id,
        user_id=current_user.id
    )
    if db_migraine is None:
        raise HTTPException(status_code=404, detail="Migraine log not found")
    return db_migraine

# Chcek if there is an unfinished log that user needs to complete
@router.get("/migraines/unfinished", response_model=Optional[Migraine])
def check_unfinished_migraine(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud_migraine.get_unfinished_migraine(db, user_id=current_user.id)