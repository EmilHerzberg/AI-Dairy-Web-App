# whisper_service/main.py

from fastapi import FastAPI, Request
import uvicorn
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torchaudio
from pydub import AudioSegment
import io

app = FastAPI()

# Load model & processor (do this once at startup)
processor = WhisperProcessor.from_pretrained("openai/whisper-base")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base")


@app.post("/transcribe")
async def transcribe_audio(request: Request):
    # 1. Get raw MP3 bytes from the request body
    audio_bytes = await request.body()
    if not audio_bytes:
        return {"error": "No audio data received"}

    # 2. Convert MP3 bytes -> WAV bytes in memory using pydub
    audio_data = io.BytesIO(audio_bytes)
    sound = AudioSegment.from_file(audio_data, format="mp3")

    # Export to WAV in memory
    wav_bytes = io.BytesIO()
    sound.export(wav_bytes, format="wav")
    wav_bytes.seek(0)

    # 3. Write the WAV to a temporary file (so torchaudio.load can read it)
    temp_filename = "temp_audio.wav"
    with open(temp_filename, "wb") as f:
        f.write(wav_bytes.read())

    # 4. Use torchaudio to load the WAV
    speech_array, sampling_rate = torchaudio.load(temp_filename)

    # (Optional) Resample to 16k if needed
    if sampling_rate != 16000:
        resampler = torchaudio.transforms.Resample(sampling_rate, 16000)
        speech_array = resampler(speech_array)
        sampling_rate = 16000

    # 5. Transcribe with Whisper
    input_values = processor(
        speech_array.squeeze(),
        return_tensors="pt",
        sampling_rate=sampling_rate
    ).input_values

    predicted_ids = model.generate(input_values)
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return {"transcription": transcription}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
