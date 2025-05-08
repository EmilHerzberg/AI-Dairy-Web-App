# whisper_service/main.py
"""
Purpose:
 - A FastAPI microservice that accepts raw audio (MP3) bytes,
   converts them to WAV, and transcribes them using a Whisper model.
 - Returns the transcript as JSON.
"""

import os

# Set environment variables for ffmpeg (if needed on Windows or custom environment)
os.environ['FFMPEG_BINARY'] = r'C:\ProgramData\chocolatey\bin\ffmpeg.exe'
os.environ['FFPROBE_BINARY'] = r'C:\ProgramData\chocolatey\bin\ffprobe.exe'

import torchaudio
from fastapi import FastAPI, Request
import uvicorn
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from pydub import AudioSegment
import io

app = FastAPI()

# Load model & processor once at startup for faster responses
processor = WhisperProcessor.from_pretrained("openai/whisper-base")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")

@app.post("/transcribe")
async def transcribe_audio(request: Request):
    """
    Accepts raw MP3 audio data, converts it to WAV, then performs
    transcription using a Whisper model from Hugging Face transformers.
    Returns a JSON with the transcription text.
    """
    # 1. Read raw request body (MP3 bytes)
    audio_bytes = await request.body()
    if not audio_bytes:
        return {"error": "No audio data received"}

    # 2. Convert MP3 bytes to WAV bytes in memory using pydub
    audio_data = io.BytesIO(audio_bytes)
    sound = AudioSegment.from_file(audio_data, format="mp3")

    wav_bytes = io.BytesIO()
    sound.export(wav_bytes, format="wav")
    wav_bytes.seek(0)

    # 3. Save WAV temporarily so torchaudio can read it
    temp_filename = "temp_audio.wav"
    with open(temp_filename, "wb") as f:
        f.write(wav_bytes.read())

    # 4. Load the WAV file with torchaudio
    speech_array, sampling_rate = torchaudio.load(temp_filename)

    # If the sampling rate is not 16k, resample it
    if sampling_rate != 16000:
        resampler = torchaudio.transforms.Resample(sampling_rate, 16000)
        speech_array = resampler(speech_array)
        sampling_rate = 16000

    # 5. Prepare the input for the model and generate the transcription
    speech_np = speech_array.squeeze().numpy()
    inputs = processor(speech_np, sampling_rate=sampling_rate, return_tensors="pt")
    input_features = inputs["input_features"]

    predicted_ids = model.generate(input_features)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return {"transcription": transcription}

# Run the service on 0.0.0.0:8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
