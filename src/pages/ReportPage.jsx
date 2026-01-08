import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReportPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If someone tries to access /report directly without taking the quiz, send them back
  if (!state || !state.questions) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4">No Quiz Data Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  const { questions, userAnswers } = state;

  // Calculate Score
  let score = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correct_answer) {
      score++;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Score Card */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-gray-600">You scored</p>
          <div className="text-5xl font-bold text-blue-600 my-4">
            {score} / {questions.length}
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
          >
            Retake Quiz
          </button>
        </div>

        {/* Detailed Report */}
        <div className="space-y-6">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.correct_answer;
            const isSkipped = userAnswer === undefined;

            let statusColor = 'border-gray-300'; // Default
            let statusText = 'Skipped';
            let statusTextColor = 'text-gray-500';

            if (!isSkipped) {
              if (isCorrect) {
                statusColor = 'border-green-500 bg-green-50';
                statusText = 'Correct';
                statusTextColor = 'text-green-700';
              } else {
                statusColor = 'border-red-500 bg-red-50';
                statusText = 'Incorrect';
                statusTextColor = 'text-red-700';
              }
            }

            return (
              <div key={index} className={`bg-white p-6 rounded-lg border-l-8 shadow-sm ${statusColor}`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 w-3/4">
                    {index + 1}. <span dangerouslySetInnerHTML={{ __html: q.question }} />
                  </h3>
                  <span className={`font-bold text-sm uppercase px-3 py-1 rounded-full bg-white border ${statusTextColor} border-current`}>
                    {statusText}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                  
                  {/* User Answer Column */}
                  <div className="p-3 bg-gray-50 rounded border">
                    <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Answer</span>
                    {isSkipped ? (
                      <span className="text-gray-400 italic">No answer selected</span>
                    ) : (
                      <span 
                        className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}
                        dangerouslySetInnerHTML={{ __html: userAnswer }}
                      />
                    )}
                  </div>

                  {/* Correct Answer Column */}
                  <div className="p-3 bg-blue-50 rounded border border-blue-100">
                    <span className="block text-xs font-bold text-blue-500 uppercase mb-1">Correct Answer</span>
                    <span 
                      className="text-gray-800 font-semibold"
                      dangerouslySetInnerHTML={{ __html: q.correct_answer }}
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;