"use client";

import "@/app/globals.css";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { ArrowLeft, Info, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingPage from "@/components/result/loading";
import LearningResultPage from "@/app/result/page";

const LearningStyleQuiz = () => {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [storyAnswer, setStoryAnswer] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState(0);
  const [isAutoNexting, setIsAutoNexting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState("");
  const countdownRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Dummy quiz questions
  const quizQuestions = [
    {
      id: 1,
      text: "Saat belajar topik baru, saya terbantu dengan melihat skema, bagan, atau gambar",
    },
    {
      id: 2,
      text: "Saya lebih mudah mengerti jika seseorang menjelaskan dengan suara yang jelas",
    },
    {
      id: 3,
      text: "Saya lebih cepat paham jika saya bisa menyentuh atau memanipulasi objek terkait",
    },
    {
      id: 4,
      text: "Saya tertarik pada tampilan presentasi yang menggunakan warna dan visual yang menarik",
    },
    {
      id: 5,
      text: "Saya sering mengulang informasi penting dengan membacanya keras-keras",
    },
    {
      id: 6,
      text: "Saya menyukai pembelajaran yang melibatkan eksperimen atau praktik langsung",
    },
    {
      id: 7,
      text: "Saya cenderung mengingat tempat atau lokasi dengan membayangkan tampilannya",
    },
    {
      id: 8,
      text: "Saya merasa lebih nyaman belajar dalam suasana diskusi kelompok",
    },
    {
      id: 9,
      text: "Saya merasa lebih fokus saat belajar sambil menggambar, menulis, atau bergerak",
    },
    {
      id: 10,
      text: "Saat membaca buku, ilustrasi atau foto membantu saya memahami isinya",
    },
    {
      id: 11,
      text: "Saya terbiasa menggunakan nada suara atau irama untuk membantu mengingat informasi",
    },
    {
      id: 12,
      text: "Saya sering belajar dari pengalaman nyata atau simulasi daripada dari teori saja",
    },
  ];

  // API calls
  const submitStoryPrediction = async (story) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/ml/predict/story",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ story }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memproses cerita");
      }

      return data;
    } catch (error) {
      console.error("Story prediction error:", error);
      throw error;
    }
  };

  const submitQuizPrediction = async (answers) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/ml/predict/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memproses jawaban quiz");
      }

      return data;
    } catch (error) {
      console.error("Quiz prediction error:", error);
      throw error;
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    if (isAutoNexting || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    if (currentQuestion < quizQuestions.length - 1) {
      setIsAutoNexting(true);
      setAutoNextCountdown(2);

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
          setCurrentQuestion((prev) => prev + 1);
          isProcessingRef.current = false;
        }
      }, 1000);
    } else {
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const handleNextQuestion = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setIsAutoNexting(false);
      setAutoNextCountdown(0);
      isProcessingRef.current = false;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const canProceedToNext = () => {
    const currentQuestionId = quizQuestions[currentQuestion].id;
    return quizAnswers[currentQuestionId] !== undefined;
  };

  const handlePrevQuestion = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
      setIsAutoNexting(false);
      setAutoNextCountdown(0);
      isProcessingRef.current = false;
    }

    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleQuizSubmit = async () => {
    setIsLoading(true);
    setError("");
    setCurrentPage("loading");

    try {
      const result = await submitQuizPrediction(quizAnswers);
      setPredictionResult(result);

      // Simulate loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage("result");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setCurrentPage("quiz");
    }
  };

  const handleStorySubmit = async () => {
    if (!storyAnswer.trim()) {
      setError("Cerita tidak boleh kosong");
      return;
    }

    setIsLoading(true);
    setError("");
    setCurrentPage("loading");

    try {
      const result = await submitStoryPrediction(storyAnswer);
      setPredictionResult(result);

      // Simulate loading time for better UX
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage("result");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      setCurrentPage("story-intro");
    }
  };

  const handleRetakeTest = () => {
    // Reset all states
    setCurrentQuestion(0);
    setQuizAnswers({});
    setStoryAnswer("");
    setPredictionResult(null);
    setError("");
    setCurrentPage("welcome");
  };

  // Show loading page
  if (currentPage === "loading") {
    return <LoadingPage />;
  }

  // Show result page
  if (currentPage === "result" && predictionResult) {
    return (
      <LearningResultPage
        learning_style={predictionResult.learning_style}
        onRetake={handleRetakeTest}
      />
    );
  }

  const renderWelcomePage = () => (
    <div className="min-h-screen bg-white flex flex-col p-6">
      <div className="mb-8">
        <button className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-4xl w-full">
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-8 ">
            Hai, Aditya
          </h1>
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-8 ">
            Ayo Tes Gaya Belajar Kamu
          </h1>
          <p className="text-[#A4A4A4] text-xl mb-12 leading-relaxed ">
            Temukan gaya belajar yang paling cocok untuk Anda! Pilih salah satu
            metode tes di bawah ini untuk mengetahui preferensi belajar Anda.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="text-center">
              <button
                onClick={() => setCurrentPage("story-intro")}
                className="w-full bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-6 px-12 rounded-full text-2xl font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Tes Bercerita
              </button>
              <p className="text-[#A4A4A4] text-lg mt-3">
                Ceritakan pengalaman dan kebiasaan belajar Anda, lalu AI akan
                menganalisis gaya belajar Anda.
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage("quiz-intro")}
                className="w-full bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-6 px-12 rounded-full text-2xl font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 mb-4"
              >
                Tes Quiz
              </button>
              <p className="text-[#A4A4A4] text-lg mt-3">
                Jawab pertanyaan singkat dengan skala 1-4 untuk menentukan gaya
                belajar Anda.
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
      <div>
        <button
          onClick={() => setCurrentPage("welcome")}
          className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-3 ">
            Hai, Aditya
          </h1>
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-5 ">
            Kira-kira bagaimana biasanya kamu belajar?
          </h1>
          <div className="flex items-center justify-center gap-3 mb-3">
            <p className="text-[#A4A4A4] text-xl mb-3 leading-relaxed ">
              Kamu bisa ceritain pengalaman kamu saat belajar, hal yang kamu
              suka saat belajar, bahkan kebiasaan unik yang kamu lakukan untuk
              belajar. Tuangkan semua dibawah ini yaa!
            </p>
            <button
              onClick={() => setShowInfoPopup(true)}
              className="text-white hover:text-cyan-100 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 p-2 rounded-full transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

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
            disabled={!storyAnswer.trim() || isLoading}
            className={`${
              !storyAnswer.trim() || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            } text-white py-4 px-16 rounded-full text-xl font-bold transition-colors`}
          >
            {isLoading ? "Memproses..." : "Submit"}
          </button>
        </div>
      </div>

      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Contoh Cerita Belajar
            </h3>
            <div className="text-gray-600 space-y-4 text-lg">
              <p>
                Saya biasanya belajar sambil mendengarkan musik instrumental...
              </p>
              <p>
                Ketika belajar matematika, saya suka membuat catatan
                berwarna-warni...
              </p>
              <p>
                Saya lebih mudah memahami materi ketika dijelaskan dengan
                diagram...
              </p>
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
      <div>
        <button
          onClick={() => setCurrentPage("welcome")}
          className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-3 ">
            Hai, Aditya
          </h1>
          <h1 className="text-5xl font-extrabold text-[#0B92C2] mb-5 ">
            Jawab beberapa pertanyaan yang terkait preferensi kamu ini yaa
          </h1>

          <div className="flex items-center justify-center gap-3 p-8 mb-5">
            <p className="text-[#A4A4A4] text-xl mb-3 leading-relaxed">
              Bakal disediakan beberapa pertanyaan tentang preferensi kamu dalam
              kehidupan sehari-hari, terutama dalam hal belajar. Kamu diminta
              untuk menjawab pertanyaan tersebut dalam skala 1-4.
            </p>
          </div>

          <div className="flex justify-between items-center mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-[#0B92C2] font-bold text-lg ">
                Sangat Tidak Setuju
              </p>
              <p className="text-[#0B92C2] font-bold text-lg ">1</p>
            </div>
            <div className="flex-1 mx-12">
              <div className="flex justify-between items-center mb-3">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="w-6 h-6 bg-[#0B92C2] rounded-full shadow-lg"
                  ></div>
                ))}
              </div>
              <div className="w-full h-2 bg-[#0B92C2] rounded-full shadow-lg"></div>
            </div>
            <div className="text-center">
              <p className="text-[#0B92C2] font-bold text-lg ">Sangat Setuju</p>
              <p className="text-[#0B92C2] font-bold text-lg ">4</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage("quiz")}
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
    const isCurrentQuestionAnswered =
      quizAnswers[currentQuestionData.id] !== undefined;

    return (
      <div className="min-h-screen bg-white flex flex-col p-6">
        <div>
          <button
            onClick={() => setCurrentPage("quiz-intro")}
            className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        <div className="max-w-4xl mx-auto flex-1 flex flex-col">
          <div className="flex flex-col h-20 mb-3">
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

          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8]  rounded-xl p-8 w-full max-w-4xl h-40 flex items-center justify-center mx-auto">
              <div className="w-full max-w-3xl">
                <h2 className="text-3xl font-bold text-white text-center leading-relaxed break-words">
                  {currentQuestionData.text}
                </h2>
              </div>
            </div>
          </div>

          <div className="h-80 flex flex-col">
            <div className="h-3 flex items-center justify-center mb-6">
              {isAutoNexting && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full py-3 px-6">
                  <p className="text-[#0B92C2] font-semibold text-lg">
                    Otomatis ke pertanyaan berikutnya dalam {autoNextCountdown}{" "}
                    detik...
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center space-x-8 mb-8">
              {[1, 2, 3, 4].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    handleQuizAnswer(currentQuestionData.id, rating)
                  }
                  disabled={isAutoNexting}
                  className={`w-16 h-16 rounded-full border-4 transition-all duration-300 text-xl font-bold shadow-2xl ${
                    isAutoNexting
                      ? quizAnswers[currentQuestionData.id] === rating
                        ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] border-none text-white scale-110 cursor-not-allowed"
                        : "border-[#0B92C2]/50 text-[#0B92C2]/50 cursor-not-allowed"
                      : quizAnswers[currentQuestionData.id] === rating
                      ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] border-none text-white scale-110"
                      : "border-[#0B92C2] text-[#0B92C2] hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center text-[#0B92C2] font-semibold text-lg w-full max-w-lg mx-auto mb-8">
              <span className="text-left">Sangat Tidak Setuju</span>
              <span className="text-right">Sangat Setuju</span>
            </div>

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
                {isCurrentQuestionAnswered &&
                  currentQuestion < totalQuestions - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="border-2 rounded-full flex items-center space-x-3 px-8 py-3 text-[#0B92C2] hover:text-cyan-500 hover:px-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}

                {currentQuestion === totalQuestions - 1 &&
                  isCurrentQuestionAnswered && (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={isLoading}
                      className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 px-8 rounded-full text-lg font-bold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      {isLoading ? "Memproses..." : "Submit Quiz"}
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
    case "welcome":
      return renderWelcomePage();
    case "story-intro":
      return renderStoryPage();
    case "quiz-intro":
      return renderQuizIntro();
    case "quiz":
      return renderQuiz();
    default:
      return renderWelcomePage();
  }
};

export default LearningStyleQuiz;
