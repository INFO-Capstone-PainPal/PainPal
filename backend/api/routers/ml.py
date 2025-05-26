from fastapi import APIRouter
import pandas as pd
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
import plotly.io as pio

from api.crud.ml import get_checkin_dataframe_for_user
from db.models.user import User
from db.db_setup import get_db
from utils.utils import get_current_active_user
from ml.rf import analyze_user_data
from ml.data_viz import plot_monthly_migraines, plot_trigger_heatmap

router = APIRouter(prefix="/ml")

@router.get("/top-triggers")
def get_top_triggers():
    df = pd.read_csv("mig_data_test.csv")  # or user-specific from DB
    result = analyze_user_data(df)

    if "warning" in result:
        return {"warning": result["warning"]}

    return {
        "average_risk": result["mean_prediction"],
        "top_triggers": result["top_triggers"]
    }

@router.get("/top-triggers")
def get_top_triggers(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    df = get_checkin_dataframe_for_user(db, current_user.id)
    result = analyze_user_data(df)

    if "warning" in result:
        return {"warning": result["warning"]}

    return {
        "average_risk": result["mean_prediction"],
        "top_triggers": result["top_triggers"]
    }

@router.get("/visualizations/monthly")
def migraine_monthly_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    df = get_checkin_dataframe_for_user(db, current_user.id)
    fig = plot_monthly_migraines(df)
    img_bytes = pio.to_image(fig, format="png")

    return Response(content=img_bytes, media_type="image/png")


@router.get("/visualizations/triggers")
def trigger_heatmap_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    df = get_checkin_dataframe_for_user(db, current_user.id)
    fig = plot_trigger_heatmap(df)
    img_bytes = pio.to_image(fig, format="png")

    return Response(content=img_bytes, media_type="image/png")
