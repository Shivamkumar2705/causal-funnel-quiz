import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StartPage = ({ setUserEmail }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setUserEmail(email);
      // Optional: Save to localStorage to persist on refresh
      localStorage.setItem('userEmail', email);
      navigate('/quiz');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">CausalFunnel Quiz</h1>
        <p className="mb-4 text-gray-600 text-center">
          Enter your email to start the 30-minute assessment.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Start Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartPage;