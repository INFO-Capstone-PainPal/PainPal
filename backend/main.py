from fastapi import FastAPI, HTTPException

app = FastAPI(
    title="PainPal",
    description="Chronic Migraine Tracking Mobile App",
    version="1.0.0"
)

@app.get("/cause_error")
async def cause_error():
    raise HTTPException(status_code=500, detail="Intentional Error for Testing")