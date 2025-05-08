import React, { useState } from 'react';
import Mp3Recorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AudioRecorder = ({ onUploadSuccess }) => {
  const [recorder] = useState(new Mp3Recorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [blobFile, setBlobFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const { user } = useAuth();

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
    if (!user || !user.token) {
      console.warn('No user token found - please login first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('audiofile', blobFile);

      const response = await axios.post(
        'http://localhost:5000/api/audio/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(response.data.success){

        console.log('Transcription:', response.data.entry);
       
              // If you want to re-fetch entries from DB to update your calendar, do so here:
                onUploadSuccess(); // e.g. a callback that calls GET /api/entries again

                setUploadMessage(response.data.message);
                // onUploadSuccess?.();
      }

      // Maybe store it in some state or show in UI
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Audio Recorder</h2>

      <div className="d-flex gap-2 mb-3">
        <button 
          onClick={startRecording} 
          disabled={isRecording}
          className="btn btn-warm"
        >
          Start
        </button>
        <button 
          onClick={stopRecording} 
          disabled={!isRecording}
          className="btn btn-secondary"
        >
          Stop
        </button>
      </div>

      {blobURL && (
        <div className="mb-3">
          <audio src={blobURL} controls />
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={!blobFile} 
        className="btn btn-primary"
      >
        Upload for Transcription
      </button>
      {uploadMessage &&   
      <p className="mt-4 text-success">{uploadMessage}</p>}
    </div>
  );
};

export default AudioRecorder;
