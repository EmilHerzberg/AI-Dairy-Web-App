import React, { useState } from 'react';
import Mp3Recorder from 'mic-recorder-to-mp3';
import axios from 'axios';

const AudioRecorder = () => {
  const [recorder] = useState(new Mp3Recorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [blobFile, setBlobFile] = useState(null);

  const startRecording = async () => {
    try {
      await recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recorder:', err);
    }
  };

  const stopRecording = async () => {
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      setIsRecording(false);
      setBlobURL(URL.createObjectURL(blob));
      setBlobFile(blob);
    } catch (err) {
      console.error('Error stopping recorder:', err);
    }
  };

  const handleUpload = async () => {
    if (!blobFile) return;
    
      try {
        // If using JWT, get the token from your auth context or localStorage
        const token = localStorage.getItem('token');
    
        const formData = new FormData();
        formData.append('audiofile', blobFile);
    
        const response = await axios.post(
          '/api/audio/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          }
        );
    
        console.log('Transcription:', response.data.transcription);
        // Maybe store it in some state or show in UI
      } catch (error) {
        console.error('Upload failed:', error);
      }
    };

  return (
    <div className="container">
      <h2>Audio Recorder</h2>
      <button onClick={startRecording} disabled={isRecording}>
        Start
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>

      {blobURL && (
        <div>
          <audio src={blobURL} controls />
        </div>
      )}

      <button onClick={handleUpload} disabled={!blobFile}>
        Upload for Transcription
      </button>
    </div>
  );
};

export default AudioRecorder;
