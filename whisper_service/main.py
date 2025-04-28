# whisper_service/main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/healthcheck")
def healthcheck():
    return {"message": "Whisper service is running!"}
