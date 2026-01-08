import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import QuizPage from './pages/QuizPage';
import ReportPage from './pages/ReportPage';

function App() {
  // We keep the email state here to pass it if needed, 
  // though we can also store it in localStorage.
  const [userEmail, setUserEmail] = useState('');

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          <Route 
            path="/" 
            element={<StartPage setUserEmail={setUserEmail} />} 
          />
          <Route 
            path="/quiz" 
            element={<QuizPage userEmail={userEmail} />} 
          />
          <Route 
            path="/report" 
            element={<ReportPage />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;