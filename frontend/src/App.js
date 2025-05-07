/* App.js */
import './App.css';
import { Routes, Route } from 'react-router-dom';
import AuthPage from '.pages/AuthPage';
import AudioRecorder from './components/AudioRecorder';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* The combined auth page is at "/" */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected route for Recorder */}
      <Route
        path="/recorder"
        element={
          <ProtectedRoute>
            <AudioRecorder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
