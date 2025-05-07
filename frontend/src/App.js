/* App.js */
import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage'; 
import RecorderCalendarPage from './pages/RecorderCalendarPage';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />

      {/* Only logged in users can see Recorder+Calendar */}
      <Route 
        path="/recorder"
        element={
          <ProtectedRoute>
            <RecorderCalendarPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
