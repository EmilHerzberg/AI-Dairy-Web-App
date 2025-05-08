// frontend/App.js

/**
 * Purpose:
 *  - Defines the main routing structure of the React app.
 *  - Sets up public (AuthPage) and protected (RecorderCalendarPage) routes.
 */

import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage'; 
import RecorderCalendarPage from './pages/RecorderCalendarPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * The App component sets up routing for the application.
 * - "/" goes to the AuthPage (login/register).
 * - "/recorder" goes to the RecorderCalendarPage, protected by ProtectedRoute.
 */
function App() {
  return (
    <Routes>
      {/* Public route for authentication */}
      <Route path="/" element={<AuthPage />} />

      {/* Protected route for the recorder and calendar page.
          ProtectedRoute checks if a user is logged in; if not, it redirects. */}
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
