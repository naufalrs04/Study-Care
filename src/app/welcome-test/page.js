"use client";

import '@/app/globals.css';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ArrowLeft, Info, ChevronLeft, ChevronRight } from 'lucide-react';

const LearningStyleQuiz = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [storyAnswer, setStoryAnswer] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState(0);
  const [isAutoNexting, setIsAutoNexting] = useState(false);
  const countdownRef = useRef(null);
  const isProcessingRef = useRef(false);

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
      text: "Kamu lebih suka berdiskusi saat belajar dengan temanmu"
    }
  ];

  const handleQuizAnswer = (questionId, answer) => {
    // Jangan proses jika sedang auto next
    // Prevent double execution
    if (isAutoNexting || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    // Update jawaban
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // // Auto next hanya jika ini bukan pertanyaan terakhir
    // if (currentQuestion < quizQuestions.length - 1) {
    //   setIsAutoNexting(true);
    //   setAutoNextCountdown(2); // Set initial countdown value
      
    //   // Countdown timer
    //   const countdownInterval = setInterval(() => {
    //     setAutoNextCountdown(prev => {
    //       if (prev <= 1) {
    //         clearInterval(countdownInterval);
    //         setIsAutoNexting(false);
    //         setCurrentQuestion(curr => curr + 1);
    //         return 0;
    //       }
    //       return prev - 1;
    //     });
    //   }, 1000);

    //   // Simpan interval ID untuk cleanup
    //   window.currentCountdownInterval = countdownInterval;
    // }
    
    // Auto next hanya jika ini bukan pertanyaan terakhir
    if (currentQuestion < quizQuestions.length - 1) {
      setIsAutoNexting(true);
      setAutoNextCountdown(2);
      
      // Clear previous interval if exists
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      
      let countdown = 2;
      countdownRef.current = setInterval(() => {
        countdown -= 1;
        setAutoNextCountdown(countdown);
        
        if (countdown <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setIsAutoNexting(false);
          setCurrentQuestion(prev => prev + 1);
          isProcessingRef.current = false;
        }
      }, 1000);
    } else {
      isProcessingRef.current = false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Fungsi untuk handle next manual
  // const handleNextQuestion = () => {
  //   // Clear auto next jika sedang berjalan
  //   if (window.currentCountdownInterval) {
  //     clearInterval(window.currentCountdownInterval);
  //     setIsAutoNexting(false);
  //     setAutoNextCountdown(0);
  //   }
    
  //   if (currentQuestion < quizQuestions.length - 1) {
  //     setCurrentQuestion(prev => prev + 1);
  //   }
  // };

  // Fungsi untuk handle next manual
  const handleNextQuestion = () => {
    // Clear auto next jika sedang berjalan
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setIsAutoNexting(false);
      setAutoNextCountdown(0);
      isProcessingRef.current = false;
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const canProceedToNext = () => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    return quizAnswers[currentQuestionId] !== undefined;
  };

  // const handlePrevQuestion = () => {
  //   // Clear auto next jika sedang berjalan
  //   if (window.currentCountdownInterval) {
  //     clearInterval(window.currentCountdownInterval);
  //     setIsAutoNexting(false);
  //     setAutoNextCountdown(0);
  //   }
    
  //   if (currentQuestion > 0) {
  //     setCurrentQuestion(prev => prev - 1);
  //   }
  // };

  const handlePrevQuestion = () => {
    // Clear auto next jika sedang berjalan
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setIsAutoNexting(false);
      setAutoNextCountdown(0);
      isProcessingRef.current = false;
    }
    
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

                <div className="relative">
                  <div className="w-full h-24 md:h-32 bg-gradient-to-t from-[#4ECDC4] to-[#7FD8E8] rounded-t-[100px] "></div>
                </div>

        </div>
    </div>
);

  const renderStoryPage = () => (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Back Button */}
      <div>
        <button 
        onClick={() => setCurrentPage('welcome')}
        className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-3 ">Hai, Aditya</h1>
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-5 ">Kira-kira bagaimana biasanya kamu belajar?</h1>
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-[#A4A4A4] text-xl mb-3 leading-relaxed ">
              Kamu bisa ceritain pengalaman kamu saat belajar, hal yang kamu suka saat belajar, 
              bahkan kebiasaan unik yang kamu lakukan untuk belajar. Tuangkan semua dibawah ini yaa!
            </p>
            <button
              onClick={() => setShowInfoPopup(true)}
              className="text-white hover:text-cyan-100 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 p-2 rounded-full transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-5">
            <textarea
              value={storyAnswer}
              onChange={(e) => setStoryAnswer(e.target.value)}
              placeholder="Ceritakan pengalaman belajar kamu di sini..."
              className="w-full h-70 p-8 border-3 border-[#A4A4A4] rounded-3xl resize-none focus:border-cyan-500 focus:outline-none text-gray-700 text-xl bg-white/90 "
            />
          </div>

          <button
            onClick={handleStorySubmit}
            disabled={!storyAnswer.trim()}
            className={`${
              !storyAnswer.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            } text-white py-4 px-16 rounded-full text-xl font-bold transition-colors`}
          >
            Submit
          </button>

        </div>
      </div>

      {/* Info Popup */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contoh Cerita Belajar</h3>
            <div className="text-gray-600 space-y-4 text-lg">
              <p>Saya biasanya belajar sambil mendengarkan musik instrumental...</p>
              <p>Ketika belajar matematika, saya suka membuat catatan berwarna-warni...</p>
              <p>Saya lebih mudah memahami materi ketika dijelaskan dengan diagram...</p>
            </div>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="mt-6 w-full bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform text-white py-3 rounded-full text-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizIntro = () => (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Back Button */}
      <div>
        <button 
        onClick={() => setCurrentPage('welcome')}
        className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto"> 
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-3 ">Hai, Aditya</h1>
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-5 ">Jawab beberapa pertanyaan yang terkait preferensi kamu ini yaa</h1>
          
          <div className="flex items-center justify-center gap-3 p-8 mb-5">
            <p className="text-[#A4A4A4] text-xl mb-3 leading-relaxed">
              Bakal disediakan beberapa pertanyaan tentang preferensi kamu dalam kehidupan sehari-hari, 
              terutama dalam hal belajar. Kamu diminta untuk menjawab pertanyaan tersebut dalam skala 1-5.
            </p>
          </div>

          <div className="flex justify-between items-center mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-[#0B92C2] font-bold text-lg ">Sangat Tidak Setuju</p>
              <p className="text-[#0B92C2] font-bold text-lg ">1</p>
            </div>
            <div className="flex-1 mx-12">
              <div className="flex justify-between items-center mb-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="w-6 h-6 bg-[#0B92C2] rounded-full shadow-lg"></div>
                ))}
              </div>
              <div className="w-full h-2 bg-[#0B92C2] rounded-full shadow-lg"></div>
            </div>
            <div className="text-center">
              <p className="text-[#0B92C2] font-bold text-lg ">Sangat Setuju</p>
              <p className="text-[#0B92C2] font-bold text-lg ">5</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('quiz')}
            className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 text-white py-4 px-16 rounded-full text-xl font-bold "
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
    const isCurrentQuestionAnswered = quizAnswers[currentQuestionData.id] !== undefined;

    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        {/* Back Button */}
        <div>
          <button 
          onClick={() => setCurrentPage('quiz-intro')}
          className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
          </button>
        </div>

        <div className="max-w-4xl mx-auto flex-1 flex flex-col"> 
          {/* DIV 1: Back Button & Progress - Fixed Height */}
          <div className="flex flex-col h-20 mb-3">
            {/* Progress */}
            <div className="text-center flex-1 flex flex-col justify-center">
              <p className="text-[#0B92C2] text-2xl font-extrabold mb-4">
                {currentQuestion + 1} l {totalQuestions}
              </p>
              <div className="w-full bg-[#A4A4A4]/50 rounded-full h-3">
                <div 
                  className="bg-gradient-to-l from-[#0B92C2] to-[#7FD8E8] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* DIV 2: Question Container - Fixed Height & Width */}
          <div className="flex-1 flex items-center justify-center">
            <div className="border-2 border-[#0B92C2]/30 rounded-xl p-8 w-full max-w-4xl h-40 flex items-center justify-center mx-auto">
              <div className="w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-[#0B92C2] text-center leading-relaxed break-words">
                  {currentQuestionData.text}
                </h2>
              </div>
            </div>
          </div>

          {/* DIV 3: Auto Next, Rating Scale, Labels & Navigation - Fixed Height */}
          <div className="h-80 flex flex-col">
            {/* Auto Next Notification - Fixed Height */}
            <div className="h-3 flex items-center justify-center mb-6">
              {isAutoNexting && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full py-3 px-6">
                  <p className="text-[#0B92C2] font-semibold text-lg">
                    Otomatis ke pertanyaan berikutnya dalam {autoNextCountdown} detik...
                  </p>
                </div>
              )}
            </div>

            {/* Rating Scale */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleQuizAnswer(currentQuestionData.id, rating)}
                  disabled={isAutoNexting}
                  className={`w-16 h-16 rounded-full border-4 transition-all duration-300 text-xl font-bold shadow-2xl ${
                    isAutoNexting
                      ? quizAnswers[currentQuestionData.id] === rating
                        ? 'bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] border-none text-white scale-110 cursor-not-allowed'
                        : 'border-[#0B92C2]/50 text-[#0B92C2]/50 cursor-not-allowed'
                      : quizAnswers[currentQuestionData.id] === rating
                      ? 'bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] border-none text-white scale-110'
                      : 'border-[#0B92C2] text-[#0B92C2] hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>

            {/* Scale Labels */}
            <div className="flex justify-between items-center text-[#0B92C2] font-semibold text-lg w-full max-w-lg mx-auto mb-8">
              <span className="text-left">Sangat Tidak Setuju</span>
              <span className="text-right">Sangat Setuju</span>
            </div>

            {/* Navigation - Fixed Height */}
            <div className="flex justify-between items-center h-16">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="border-2 rounded-full flex items-center space-x-3 px-8 py-3 text-[#0B92C2] hover:text-cyan-500 hover:px-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                {/* Next Button - hanya muncul jika pertanyaan sudah dijawab dan bukan pertanyaan terakhir */}
                {isCurrentQuestionAnswered && currentQuestion < totalQuestions - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="border-2 rounded-full flex items-center space-x-3 px-8 py-3 text-[#0B92C2] hover:text-cyan-500 hover:px-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Submit Button - hanya muncul di pertanyaan terakhir jika sudah dijawab */}
                {currentQuestion === totalQuestions - 1 && isCurrentQuestionAnswered && (
                  <button
                    onClick={handleQuizSubmit}
                    className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 px-8 rounded-full text-lg font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

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
    default:
      return renderWelcomePage();
  }
};

export default LearningStyleQuiz;