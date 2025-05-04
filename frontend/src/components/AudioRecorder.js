import React, { useState } from 'react';
import Mp3Recorder from 'mic-recorder-to-mp3';

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

    // We will implement the Axios upload request here soon
    // after we create the Node.js endpoint.
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
