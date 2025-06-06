import os
import sys
from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import plotly.io as pio
from io import BytesIO

# Allow importing from root-level `ml/`
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.api.crud.ml import construct_ml_dataframe
from backend.db.models.user import User
from backend.db.db_setup import get_db
from backend.utils.utils import get_current_active_user
from ml.rf import analyze_user_data
from ml.data_viz import plot_monthly_migraines, plot_trigger_heatmap, top_10_triggers

router = APIRouter(prefix="/ml", tags=["ml"])

@router.get("/ml/top-triggers")
def run_test_model(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    df = construct_ml_dataframe(db, current_user.id)
    result = analyze_user_data(df)
    return result

@router.get("/visualizations/monthly")
def migraine_monthly_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    df = construct_ml_dataframe(db, current_user.id)
    fig = plot_monthly_migraines(df)
    img_bytes = pio.to_image(fig, format="png")
    return Response(content=img_bytes, media_type="image/png")

@router.get("/visualizations/triggers")
def trigger_heatmap_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    df = construct_ml_dataframe(db, current_user.id)
    fig = plot_trigger_heatmap(df)
    img_bytes = pio.to_image(fig, format="png")
    return Response(content=img_bytes, media_type="image/png")

@router.get("/ml/trigger-graph")
def get_trigger_graph(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    df = construct_ml_dataframe(db, current_user.id)
    fig = top_10_triggers(df)

    # Save to BytesIO as PNG
    img_bytes = BytesIO()
    fig.write_image(img_bytes, format="png", engine="kaleido")
    img_bytes.seek(0)

    return StreamingResponse(img_bytes, media_type="image/png")