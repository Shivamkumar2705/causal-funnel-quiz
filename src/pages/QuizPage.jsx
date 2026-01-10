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
  const [userAnswers, setUserAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); 

  // Timer State
  const [timeLeft, setTimeLeft] = useState(1800);

  // 1. Fetch Questions
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=15');
      const formattedQuestions = res.data.results.map((q) => {
        const allOptions = [...q.incorrect_answers, q.correct_answer];
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

  // 3. Mark Visited
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

  const handleClearSelection = () => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[currentQuestionIndex];
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    navigate('/report', { state: { questions, userAnswers } });
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading Questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden"> 
      
      {/* LEFT: Main Question Area */}
      <div className="flex-1 p-4 md:p-10 flex flex-col h-full overflow-hidden">
        
        {/* Header with Timer (Fixed at top) */}
        <div className="flex justify-between items-center mb-2 md:mb-4 border-b pb-2 shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1}</h2>
          <div className="text-lg md:text-xl font-mono font-bold text-red-600 bg-red-100 px-3 py-1 rounded">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Scrollable Content Area (Contains Question AND Buttons now) */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Question Box */}
          <div 
              key={currentQuestionIndex}
              className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in"
          >
            <h3 
              className="text-base md:text-lg font-medium mb-4 text-gray-800"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }} 
            />

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-3 md:p-4 text-sm md:text-base rounded-lg border transition-all ${
                    userAnswers[currentQuestionIndex] === option
                      ? 'bg-blue-100 border-blue-500 text-blue-800 font-semibold'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  dangerouslySetInnerHTML={{ __html: option }}
                />
              ))}
            </div>
          </div>

          {/* Buttons (Moved inside scroll view to sit right below options) */}
          <div className="flex flex-col mt-6 pb-4"> 
             {userAnswers[currentQuestionIndex] && (
              <button 
                  onClick={handleClearSelection}
                  className="self-start mb-2 text-red-500 hover:text-red-700 font-semibold underline text-xs md:text-sm"
              >
                  Clear Selection
              </button>
            )}

            <div className="flex justify-between w-full">
              <button 
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 text-sm md:text-base"
              >
                  Previous
              </button>
              
              <button 
                  onClick={() => {
                      if (currentQuestionIndex < questions.length - 1) {
                          setCurrentQuestionIndex(prev => prev + 1);
                      } else {
                          handleSubmitQuiz(); 
                      }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm md:text-base"
              >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT: Question Overview Panel (Compact Mobile View) */}
      <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-gray-200 p-3 md:p-6 flex flex-col shrink-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] md:shadow-none">
        
        <h3 className="text-base md:text-lg font-bold mb-2 md:mb-4 hidden md:block">Overview</h3>
        
        {/* Grid of Numbers - Reduced Max Height on Mobile */}
        <div className="flex flex-wrap md:grid md:grid-cols-4 gap-2 justify-center md:justify-start max-h-24 md:max-h-none overflow-y-auto">
          {questions.map((_, idx) => {
            const isAttempted = userAnswers[idx] !== undefined;
            const isVisited = visitedQuestions.has(idx);
            const isCurrent = currentQuestionIndex === idx;

            let bgColor = 'bg-gray-200';
            let textColor = 'text-gray-600';

            if (isCurrent) {
                bgColor = 'bg-blue-600';
                textColor = 'text-white';
            } else if (isAttempted) {
                bgColor = 'bg-green-500';
                textColor = 'text-white';
            } else if (isVisited) {
                bgColor = 'bg-yellow-100 border-yellow-400 border';
                textColor = 'text-yellow-700';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center font-medium text-xs md:text-sm transition-all ${bgColor} ${textColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend - Tighter spacing, specific margin from top (mt-3) */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-2 text-[10px] md:text-sm text-gray-600 mt-3 mb-2 md:mb-0 md:space-y-2 md:block">
            <div className="flex items-center"><span className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full mr-1 md:mr-2"></span> Current</div>
            <div className="flex items-center"><span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-1 md:mr-2"></span> Attempted</div>
            <div className="flex items-center"><span className="w-2 h-2 md:w-3 md:h-3 bg-yellow-100 border border-yellow-400 rounded-full mr-1 md:mr-2"></span> Visited</div>
            <div className="flex items-center"><span className="w-2 h-2 md:w-3 md:h-3 bg-gray-200 rounded-full mr-1 md:mr-2"></span> Left</div>
        </div>

        <button 
          onClick={handleSubmitQuiz}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 md:py-3 rounded-lg shadow-md text-sm md:text-base"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;