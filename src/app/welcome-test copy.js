import '@/app/globals.css';
import Image from 'next/image';
import React, { useState } from 'react';
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

  const canProceedToNext = () => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    return quizAnswers[currentQuestionId] !== undefined;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1 && canProceedToNext()) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuizSubmit = () => {
    console.log('Quiz Answers:', quizAnswers);
    // Here you would send data to ML model
    alert('Quiz data saved! Ready to send to ML model.');
  };

  const handleStorySubmit = () => {
    console.log('Story Answer:', storyAnswer);
    // Here you would send data to ML model
    alert('Story data saved! Ready to send to ML model.');
  };

  const renderWelcomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Tes Gaya Belajar</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Temukan gaya belajar yang paling cocok untuk Anda! Pilih salah satu metode tes di bawah ini untuk mengetahui preferensi belajar Anda.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setCurrentPage('story-intro')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl text-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Tes Bercerita
          </button>
          <p className="text-sm text-gray-500 mb-4">Ceritakan pengalaman belajar Anda</p>
          
          <button
            onClick={() => setCurrentPage('quiz-intro')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-2xl text-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Tes Quiz
          </button>
          <p className="text-sm text-gray-500">Jawab pertanyaan dengan skala 1-5</p>
        </div>
      </div>
    </div>
  );

  const renderStoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Hai, Aditya</h2>
            <h3 className="text-xl text-gray-700 mb-2">Kira-kira bagaimana biasanya kamu belajar?</h3>
            <div className="flex items-center justify-center gap-2 mb-6">
              <p className="text-gray-500">
                Kamu bisa ceritain pengalaman kamu saat belajar, hal yang kamu suka saat belajar, 
                bahkan kebiasaan unik yang kamu lakukan untuk belajar. Tuangkan semua dibawah ini yaa!
              </p>
              <button
                onClick={() => setShowInfoPopup(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={storyAnswer}
              onChange={(e) => setStoryAnswer(e.target.value)}
              placeholder="Ceritakan pengalaman belajar kamu di sini..."
              className="w-full h-64 p-6 border-2 border-gray-200 rounded-2xl resize-none focus:border-blue-500 focus:outline-none text-gray-700 text-lg"
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleStorySubmit}
              disabled={!storyAnswer.trim()}
              className="bg-blue-500 text-white py-3 px-12 rounded-2xl text-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contoh Cerita Belajar</h3>
            <div className="text-gray-600 space-y-3">
              <p>Saya biasanya belajar sambil mendengarkan musik instrumental...</p>
              <p>Ketika belajar matematika, saya suka membuat catatan berwarna-warni...</p>
              <p>Saya lebih mudah memahami materi ketika dijelaskan dengan diagram...</p>
            </div>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Hai, Aditya</h2>
          <h3 className="text-xl text-gray-700 mb-6">Jawab beberapa pertanyaan yang terkait preferensi kamu ini yaa</h3>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <p className="text-gray-600">
              Bakal disediakan beberapa pertanyaan tentang preferensi kamu dalam kehidupan sehari-hari, 
              terutama dalam hal belajar. Kamu diminta untuk menjawab pertanyaan tersebut dalam skala 1-5.
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="text-center">
              <p className="text-blue-500 font-semibold">Sangat Tidak Setuju</p>
              <p className="text-sm text-gray-500">1</p>
            </div>
            <div className="flex-1 mx-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="w-4 h-4 bg-blue-500 rounded-full"></div>
                ))}
              </div>
              <div className="w-full h-1 bg-blue-500 mt-2 rounded"></div>
            </div>
            <div className="text-center">
              <p className="text-blue-500 font-semibold">Sangat Setuju</p>
              <p className="text-sm text-gray-500">5</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('quiz')}
            className="bg-blue-500 text-white py-3 px-12 rounded-2xl text-lg font-semibold hover:bg-blue-600 transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentPage('quiz-intro')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Progress */}
            <div className="text-center mb-8">
              <p className="text-blue-600 text-lg font-semibold mb-2">
                {currentQuestion + 1} | {totalQuestions}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">
                {currentQuestionData.text}
              </h2>

              {/* Rating Scale */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleQuizAnswer(currentQuestionData.id, rating)}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                      quizAnswers[currentQuestionData.id] === rating
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 hover:border-blue-400 text-gray-600'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>

              {/* Scale Labels */}
              <div className="flex justify-between items-center text-sm text-gray-500 max-w-md mx-auto">
                <span>Sangat Tidak Setuju</span>
                <span>Sangat Setuju</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              {currentQuestion === totalQuestions - 1 ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={!canProceedToNext()}
                  className="bg-green-500 text-white py-3 px-8 rounded-2xl font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={!canProceedToNext()}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage('welcome')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Hai, Aditya</h2>
          <h3 className="text-xl text-gray-700 mb-8">Ayo Tes Gaya Belajar Kamu</h3>
          <p className="text-gray-500 mb-8">Silahkan pilih jenis tes yang kamu suka</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <button
                onClick={() => setCurrentPage('story-intro')}
                className="w-full bg-blue-500 text-white py-6 px-8 rounded-2xl text-xl font-semibold hover:bg-blue-600 transition-colors mb-4"
              >
                Bercerita
              </button>
              <p className="text-gray-500 text-sm">
                Tes Lorem ipsum dolor adipiscing elit, sed do eiusmod tempor incidunt labore et dolore magna aliqua.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('quiz-intro')}
                className="w-full bg-blue-500 text-white py-6 px-8 rounded-2xl text-xl font-semibold hover:bg-blue-600 transition-colors mb-4"
              >
                Quiz
              </button>
              <p className="text-gray-500 text-sm">
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