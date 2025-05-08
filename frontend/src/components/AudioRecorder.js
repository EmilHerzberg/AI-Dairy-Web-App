// frontend/components/AudioRecorder.js

/**
 * Purpose:
 *  - Manages audio recording via mic-recorder-to-mp3.
 *  - Allows playback of recorded audio and upload for transcription.
 *  - On successful upload, triggers a callback (onUploadSuccess).
 */

import React, { useState } from 'react';
import Mp3Recorder from 'mic-recorder-to-mp3';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

/**
 * AudioRecorder manages:
 *  - Recording state using mic-recorder-to-mp3
 *  - Audio playback once recorded
 *  - Uploading of the audio for transcription
 *  - Triggering a callback on successful upload
 */
const AudioRecorder = ({ onUploadSuccess }) => {
  // Instantiate the recorder with a specified bit rate
  const [recorder] = useState(new Mp3Recorder({ bitRate: 128 }));
  // Track if currently recording
  const [isRecording, setIsRecording] = useState(false);
  // A blob URL to allow playback of the recorded audio
  const [blobURL, setBlobURL] = useState('');
  // The raw blob file data to be uploaded
  const [blobFile, setBlobFile] = useState(null);
  // Message shown after a successful upload
  const [uploadMessage, setUploadMessage] = useState('');
  // Retrieve current user data from context
  const { user } = useAuth();

  /**
   * Start the recording process. 
   * Requests microphone access and begins capturing audio.
   */
  const startRecording = async () => {
    try {
      await recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recorder:', err);
    }
  };

  /**
   * Stop the recording and generate an MP3 blob.
   * We store the blob for later playback and uploading.
   */
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
   * Upload the recorded audio blob to the server endpoint.
   * Includes the JWT token in the headers for authorization.
   */
  const handleUpload = async () => {
    if (!blobFile) return;
    if (!user || !user.token) {
      console.warn('No user token found - please login first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Create FormData object and attach the audio file
      const formData = new FormData();
      formData.append('audiofile', blobFile);

      // POST the form data to our backend route
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

      // If backend responds successfully, show message and trigger callback
      if(response.data.success){
        console.log('Transcription:', response.data.entry);
        onUploadSuccess(); 
        setUploadMessage(response.data.message);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Audio Recorder</h2>

      {/* Recording controls */}
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

      {/* Audio playback UI if a recording is available */}
      {blobURL && (
        <div className="mb-3">
          <audio src={blobURL} controls />
        </div>
      )}

      {/* Button to upload for transcription */}
      <button 
        onClick={handleUpload} 
        disabled={!blobFile} 
        className="btn btn-primary"
      >
        Upload for Transcription
      </button>

      {/* Success message after upload */}
      {uploadMessage && (
        <p className="mt-4 text-success">{uploadMessage}</p>
      )}
    </div>
  );
};

export default AudioRecorder;
