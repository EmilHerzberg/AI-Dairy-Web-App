import logo from './logo.svg';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AudioRecorder from './components/AudioRecorder';




function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/recorder" element={<AudioRecorder />} />
    </Routes>
  );
}

export default App;
