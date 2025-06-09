# Daily Diary Transcription App

A full-stack web application that allows users to record audio diary entries, automatically transcribe them using OpenAI’s Whisper model, and conveniently review them through a calendar interface.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Prerequisites & System Requirements](#prerequisites--system-requirements)
4. [Installation Steps](#installation-steps)
5. [FFmpeg Installation & Configuration (Windows)](#ffmpeg-installation--configuration-windows)
6. [MongoDB Atlas Setup](#mongodb-atlas-setup)
7. [Testing the App](#testing-the-app)
8. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Project Overview

This application allows users to:

* **Securely Register/Login** using JWT authentication.
* **Record audio diary entries** directly from their browser.
* **Automatically transcribe audio** entries via an integrated Whisper AI model.
* **View and manage transcripts** through an interactive calendar.

---

## Technology Stack

* **Frontend:** React 19.1, Bootstrap 5
* **Backend:** Node.js (Express 5), Mongoose (MongoDB)
* **Database:** MongoDB Atlas (Cloud)
* **Microservice:** FastAPI (Python 3.12), Whisper model (Hugging Face Transformers)
* **Authentication:** JWT, bcrypt (password hashing)
* **Audio Handling:** mic-recorder-to-mp3 (Web Audio API)

---

## Prerequisites & System Requirements

* **Operating System:** Windows (special FFmpeg setup required), macOS, Linux
* **Node.js:** Version 18.15.0
* **npm:** Check using `npm -v`
* **Python:** Version 3.12 (due to torchaudio compatibility)
* **MongoDB Atlas Account**
* **FFmpeg:** Essential for audio processing

---

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/EmilHerzberg/AI-Dairy-Web-App.git
cd AI-Dairy-Web-App
```

### 2. Environment Variables

Create `.env` in the `backend` folder:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<cluster-url>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=randomLongString
TOKEN_EXPIRES_IN=3600
```

*Do not commit `.env` files to GitHub.*

### 3. Backend Setup

```bash
cd backend
npm install
node src/index.js
```

Backend listens on `http://localhost:5000`.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend available at `http://localhost:3000`.

### 5. Whisper Microservice Setup

```bash
cd ../whisper_service
python -m venv .venv312
```

Activate virtual environment:

* **Windows:** `.venv312\Scripts\activate`
* **macOS/Linux:** `source .venv312/bin/activate`

Install dependencies:

```bash
pip install fastapi uvicorn torch torchaudio transformers pydub
```

Run the microservice:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Service runs at `http://localhost:8000`.

---

## FFmpeg Installation & Configuration (Windows)

1. Install Chocolatey: [Chocolatey Install](https://chocolatey.org/install)
2. Install FFmpeg:

```powershell
choco install ffmpeg
```

3. Add FFmpeg to System Path (if not added automatically):

* Open **System Properties** → **Environment Variables**
* Edit `Path` → Add: `C:\ProgramData\chocolatey\bin`

**Workaround if environment variable issues persist:** Add these lines in Python script (`main.py`):

```python
import os
os.environ['FFMPEG_BINARY'] = r'C:\ProgramData\chocolatey\bin\ffmpeg.exe'
os.environ['FFPROBE_BINARY'] = r'C:\ProgramData\chocolatey\bin\ffprobe.exe'
```

*macOS/Linux*: FFmpeg typically installed via Homebrew (`brew install ffmpeg`) or `apt-get`.

---

## MongoDB Atlas Setup

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Cluster and Database.
3. Set Database Access: create user credentials.
4. In **Network Access**, whitelist the IP address you will use to connect.
5. Obtain Connection URI and update `.env`:

```bash
mongodb+srv://<DB_USER>:<DB_PASSWORD>@<cluster-url>/<DB_NAME>?retryWrites=true&w=majority
```

---

## Testing the App

Ensure all components run simultaneously:

* Backend at `http://localhost:5000`
* Frontend at `http://localhost:3000`
* Whisper service at `http://localhost:8000`

Test the complete flow:

* Register/Login
* Record and upload audio
* View transcribed entries in calendar

---

## Troubleshooting & Common Issues

* **FFmpeg Not Found:** Ensure installation and correct PATH or use Python workaround.
* **JWT Issues:** Verify `.env` configuration (`JWT_SECRET`).
* **MongoDB Connection Issues:** Confirm correct URI and IP whitelist.
* **Port Conflicts:** Ensure ports 3000, 5000, and 8000 are free.
* **Python Compatibility:** Check PyTorch and Torchaudio compatibility with Python 3.12.
* **CORS Issues:** Backend configured with `cors()`, verify allowed origins.

Enjoy using the Daily Diary Transcription App! 
