import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const navigate = useNavigate();
  
  // State for Quiz Data
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for User Progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Stores { questionIndex: selectedOption }
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // Track visited indexes

  // Timer State (30 minutes = 1800 seconds)
  const [timeLeft, setTimeLeft] = useState(1800);

  // 1. Fetch Questions on Mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=15');
      // Format questions to combine correct/incorrect answers
      const formattedQuestions = res.data.results.map((q) => {
        const allOptions = [...q.incorrect_answers, q.correct_answer];
        // Simple shuffle for options
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        return { ...q, options: shuffledOptions };
      });
      setQuestions(formattedQuestions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions", error);
      setLoading(false);
    }
  };

  // 2. Timer Logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // 3. Mark current question as visited whenever index changes
  useEffect(() => {
    setVisitedQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  }, [currentQuestionIndex]);

  // Helpers
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleOptionSelect = (option) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: option });
  };

  // NEW: Function to clear the selected answer
  const handleClearSelection = () => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestionIndex];
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    // Navigate to Report Page with data
    navigate('/report', { state: { questions, userAnswers } });
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading Questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      
      {/* LEFT: Main Question Area */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header with Timer */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1}</h2>
          <div className="text-xl font-mono font-bold text-red-600 bg-red-100 px-4 py-1 rounded">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Content - WITH ANIMATION */}
        <div 
            key={currentQuestionIndex}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in"
        >
          <h3 
            className="text-lg font-medium mb-6 text-gray-800"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }} // API returns HTML entities
          />

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  userAnswers[currentQuestionIndex] === option
                    ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                dangerouslySetInnerHTML={{ __html: option }}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons (Prev/Next) */}
        <div className="flex flex-col mt-8">
           {/* Clear Selection Button - Only visible if an answer is selected */}
           {userAnswers[currentQuestionIndex] && (
            <button 
                onClick={handleClearSelection}
                className="self-start mb-4 text-red-500 hover:text-red-700 font-semibold underline text-sm transition-colors"
            >
                Clear Selection
            </button>
          )}

          <div className="flex justify-between w-full">
            <button 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
                Previous
            </button>
            
            <button 
                onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(prev => prev + 1);
                    } else {
                        handleSubmitQuiz(); // Or just stay there
                    }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Question Overview Panel */}
      <div className="w-full md:w-80 bg-white border-l border-gray-200 p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-4">Overview</h3>
        
        <div className="grid grid-cols-4 gap-3 mb-6">
          {questions.map((_, idx) => {
            const isAttempted = userAnswers[idx] !== undefined;
            const isVisited = visitedQuestions.has(idx);
            const isCurrent = currentQuestionIndex === idx;

            // Determine Color Logic
            let bgColor = 'bg-gray-200'; // Default: Not visited
            let textColor = 'text-gray-600';

            if (isCurrent) {
                bgColor = 'bg-blue-600'; // Current Question (Highlight)
                textColor = 'text-white';
            } else if (isAttempted) {
                bgColor = 'bg-green-500'; // Attempted
                textColor = 'text-white';
            } else if (isVisited) {
                bgColor = 'bg-yellow-100 border-yellow-400 border'; // Visited but not attempted
                textColor = 'text-yellow-700';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${bgColor} ${textColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="space-y-2 text-sm text-gray-600 mt-auto">
            <div className="flex items-center"><span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span> Current</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Attempted</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-yellow-100 border border-yellow-400 rounded-full mr-2"></span> Visited</div>
            <div className="flex items-center"><span className="w-3 h-3 bg-gray-200 rounded-full mr-2"></span> Not Visited</div>
        </div>

        <button 
          onClick={handleSubmitQuiz}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;