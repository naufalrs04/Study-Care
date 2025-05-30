import '@/app/globals.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const LearningStyleQuiz = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [storyAnswer, setStoryAnswer] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Dummy quiz questions
  const quizQuestions = [
    {
      id: 1,
      text: "Kamu cenderung tidak fokus jika belajar di keramaian"
    },
    {
      id: 2,
      text: "Kamu lebih suka belajar dengan membaca daripada mendengar"
    },
    {
      id: 3,
      text: "Kamu mudah mengingat informasi yang disajikan dalam bentuk visual"
    },
    {
      id: 4,
      text: "Kamu lebih memahami konsep dengan praktek langsung"
    },
    {
      id: 5,
      text: "Kamu suka berdiskusi saat belajar dengan teman"
    }
  ];

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Auto-advance to next question after selecting an answer (except for last question)
  useEffect(() => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    const hasAnswer = quizAnswers[currentQuestionId] !== undefined;
    
    if (hasAnswer && currentQuestion < quizQuestions.length - 1) {
      const timer = setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 800); // Small delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [quizAnswers, currentQuestion, quizQuestions.length]);

  const canProceedToNext = () => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    return quizAnswers[currentQuestionId] !== undefined;
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    console.log('Quiz Answers:', quizAnswers);
    alert('Quiz data saved! Ready to send to ML model.');
  };

  const handleStorySubmit = () => {
    console.log('Story Answer:', storyAnswer);
    alert('Story data saved! Ready to send to ML model.');
  };

  const renderWelcomePage = () => (
    <div className="min-h-screen bg-white flex flex-col p-6">
        {/* Back Button */}
        <div className="mb-8">
        <button className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-4xl w-full">
            <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-8 ">Hai, Aditya</h1>
            <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-8 ">Ayo Tes Gaya Belajar Kamu</h1>
            <p className="text-[#A4A4A4] text-xl mb-12 leading-relaxed ">
            Temukan gaya belajar yang paling cocok untuk Anda! Pilih salah satu metode tes di bawah ini untuk mengetahui preferensi belajar Anda.
            </p>
            
            {/* Two buttons side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="text-center">
                <button
                onClick={() => setCurrentPage('story-intro')}
                className="w-full bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-6 px-12 rounded-full text-2xl font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 mb-4"
                >
                Tes Bercerita
                </button>
                <p className="text-[#A4A4A4] text-lg mt-3">
                Tes Lorem ipsum dolor adipiscing elit, sed do eiusmod tempor incididunt labore et dolore magna aliqua.
                </p>
            </div>
            
            <div className="text-center">
                <button
                onClick={() => setCurrentPage('quiz-intro')}
                className="w-full bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-6 px-12 rounded-full text-2xl font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 mb-4"
                >
                Tes Quiz
                </button>
                <p className="text-[#A4A4A4] text-lg mt-3">
                Tes Lorem ipsum dolor adipiscing elit, sed do eiusmod tempor incididunt labore et dolore magna aliqua.
                </p>
            </div>
            </div>
        </div>
        </div>
    </div>
);

  const renderStoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-cyan-300 to-cyan-400 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-8 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full transition-colors shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Hai, Aditya</h2>
          <h3 className="text-2xl text-white mb-4 drop-shadow">Kira-kira bagaimana biasanya kamu belajar?</h3>
          <div className="flex items-center justify-center gap-3 mb-8">
            <p className="text-white text-lg drop-shadow max-w-3xl">
              Kamu bisa ceritain pengalaman kamu saat belajar, hal yang kamu suka saat belajar, 
              bahkan kebiasaan unik yang kamu lakukan untuk belajar. Tuangkan semua dibawah ini yaa!
            </p>
            <button
              onClick={() => setShowInfoPopup(true)}
              className="text-white hover:text-cyan-100 bg-cyan-500 hover:bg-cyan-600 p-2 rounded-full transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-8">
            <textarea
              value={storyAnswer}
              onChange={(e) => setStoryAnswer(e.target.value)}
              placeholder="Ceritakan pengalaman belajar kamu di sini..."
              className="w-full h-80 p-8 border-4 border-white rounded-3xl resize-none focus:border-cyan-200 focus:outline-none text-gray-700 text-xl bg-white/90 backdrop-blur shadow-2xl"
            />
          </div>

          <button
            onClick={handleStorySubmit}
            disabled={!storyAnswer.trim()}
            className="bg-cyan-500 text-white py-4 px-16 rounded-full text-xl font-bold hover:bg-cyan-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-2xl"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contoh Cerita Belajar</h3>
            <div className="text-gray-600 space-y-4 text-lg">
              <p>"Saya biasanya belajar sambil mendengarkan musik instrumental..."</p>
              <p>"Ketika belajar matematika, saya suka membuat catatan berwarna-warni..."</p>
              <p>"Saya lebih mudah memahami materi ketika dijelaskan dengan diagram..."</p>
            </div>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="mt-6 w-full bg-cyan-500 text-white py-3 rounded-full text-lg hover:bg-cyan-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-cyan-300 to-cyan-400 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-8 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full transition-colors shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Hai, Aditya</h2>
          <h3 className="text-2xl text-white mb-8 drop-shadow">Jawab beberapa pertanyaan yang terkait preferensi kamu ini yaa</h3>
          
          <div className="bg-white/20 backdrop-blur rounded-3xl p-8 mb-12 shadow-2xl">
            <p className="text-white text-lg leading-relaxed">
              Bakal disediakan beberapa pertanyaan tentang preferensi kamu dalam kehidupan sehari-hari, 
              terutama dalam hal belajar. Kamu diminta untuk menjawab pertanyaan tersebut dalam skala 1-5.
            </p>
          </div>

          <div className="flex justify-between items-center mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-white font-bold text-lg drop-shadow">Sangat Tidak Setuju</p>
              <p className="text-white text-lg drop-shadow">1</p>
            </div>
            <div className="flex-1 mx-12">
              <div className="flex justify-between items-center mb-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="w-6 h-6 bg-white rounded-full shadow-lg"></div>
                ))}
              </div>
              <div className="w-full h-2 bg-white rounded-full shadow-lg"></div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg drop-shadow">Sangat Setuju</p>
              <p className="text-white text-lg drop-shadow">5</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('quiz')}
            className="bg-cyan-500 text-white py-4 px-16 rounded-full text-xl font-bold hover:bg-cyan-600 transition-colors shadow-2xl"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const currentQuestionData = quizQuestions[currentQuestion];
    const totalQuestions = quizQuestions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-cyan-300 to-cyan-400 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('quiz-intro')}
            className="mb-8 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full transition-colors shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            {/* Progress */}
            <div className="mb-12">
              <p className="text-white text-2xl font-bold mb-4 drop-shadow">
                {currentQuestion + 1} | {totalQuestions}
              </p>
              <div className="w-full bg-white/30 rounded-full h-3 shadow-lg">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-white mb-16 drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
                {currentQuestionData.text}
              </h2>

              {/* Rating Scale */}
              <div className="flex justify-center items-center space-x-8 mb-12">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleQuizAnswer(currentQuestionData.id, rating)}
                    className={`w-16 h-16 rounded-full border-4 transition-all duration-300 text-xl font-bold shadow-2xl ${
                      quizAnswers[currentQuestionData.id] === rating
                        ? 'bg-white border-white text-cyan-500 scale-110'
                        : 'border-white text-white hover:bg-white/20 hover:scale-105'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between items-center text-white font-semibold text-lg max-w-lg mx-auto drop-shadow">
                <span>Sangat Tidak Setuju</span>
                <span>Sangat Setuju</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-3 px-8 py-4 text-white hover:text-cyan-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Previous</span>
              </button>

              {currentQuestion === totalQuestions - 1 && canProceedToNext() && (
                <button
                  onClick={handleQuizSubmit}
                  className="bg-white text-cyan-500 py-4 px-12 rounded-full font-bold text-lg hover:bg-cyan-50 transition-colors shadow-2xl"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-cyan-300 to-cyan-400 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-8 bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full transition-colors shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Hai, Aditya</h2>
          <h3 className="text-2xl text-white mb-8 drop-shadow">Ayo Tes Gaya Belajar Kamu</h3>
          <p className="text-white text-lg mb-12 drop-shadow">Silahkan pilih jenis tes yang kamu suka</p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('story-intro')}
                className="w-full bg-cyan-500 text-white py-8 px-12 rounded-full text-2xl font-bold hover:bg-cyan-600 transition-colors mb-6 shadow-2xl"
              >
                Bercerita
              </button>
              <p className="text-white text-lg drop-shadow">
                Tes Lorem ipsum dolor adipiscing elit, sed do eiusmod tempor incidunt labore et dolore magna aliqua.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('quiz-intro')}
                className="w-full bg-cyan-500 text-white py-8 px-12 rounded-full text-2xl font-bold hover:bg-cyan-600 transition-colors mb-6 shadow-2xl"
              >
                Quiz
              </button>
              <p className="text-white text-lg drop-shadow">
                Tes Lorem ipsum dolor adipiscing elit, sed do eiusmod tempor incidunt labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  switch (currentPage) {
    case 'welcome':
      return renderWelcomePage();
    case 'story-intro':
      return renderStoryPage();
    case 'quiz-intro':
      return renderQuizIntro();
    case 'quiz':
      return renderQuiz();
    case 'test-selection':
      return renderTestSelection();
    default:
      return renderWelcomePage();
  }
};

export default LearningStyleQuiz;