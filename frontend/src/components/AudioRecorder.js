import React, { useState } from 'react';
import Mp3Recorder from 'mic-recorder-to-mp3';
import axios from 'axios';

const AudioRecorder = () => {
  const [recorder] = useState(new Mp3Recorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [blobFile, setBlobFile] = useState(null);
  const [devToken, setDevToken] = useState('');

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

  /**
   *  1) Call the dev-token endpoint to get a dummy token.
   *  2) Store it in localStorage so your handleUpload can read it.
   */
  const handleGetDevToken = async () => {
    try {
      const res = await axios.get('http://localhost:5000/auth/dev-token');
      const token = res.data.token;
      localStorage.setItem('token', token);
      setDevToken(token);
      console.log('Dev token retrieved:', token);
    } catch (error) {
      console.error('Failed to get dev token:', error);
    }
  };

  const handleUpload = async () => {
    if (!blobFile) return;

    try {
      // If using JWT, get the token from localStorage
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('audiofile', blobFile);

      const response = await axios.post(
        'http://localhost:5000/api/audio/upload',
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
      
      {/*  Button for dev-token */}
      <button onClick={handleGetDevToken}>
        Get Dev Token
      </button>
      {devToken && (
        <p style={{ color: 'blue' }}>
          Current devToken: {devToken}
        </p>
      )}

      <hr />

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
