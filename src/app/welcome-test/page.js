"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Info,
  ChevronLeft,
  ChevronRight,
  Brain,
  BookOpen,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Share,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Learning Styles Data
const learningStyles = {
  1: {
    name: "Auditori",
    description:
      "Pembelajar auditori lebih mudah memahami dan mengingat informasi melalui pendengaran. Mereka cenderung menyerap informasi secara efektif melalui penjelasan lisan, diskusi, ceramah, atau rekaman suara.",
    characteristics: [
      "Lebih mudah memahami konsep saat dibacakan atau didiskusikan",
      "Suka mendengarkan podcast, audio, atau musik sambil belajar",
      "Lebih suka menjelaskan materi dengan kata-kata daripada tulisan",
      "Menyukai diskusi kelompok atau debat ide",
    ],
    tips: [
      "Rekam penjelasan sendiri dan dengarkan ulang",
      "Ikuti diskusi kelompok atau baca materi dengan suara keras",
      "Gunakan lagu atau jingle untuk menghafal rumus",
      "Gunakan audiobook atau podcast edukasi",
    ],
    icon: <Users className="w-8 h-8" />,
  },
  2: {
    name: "Visual",
    description:
      "Pembelajar visual lebih mudah memahami dan mengingat informasi melalui gambar, diagram, atau peta konsep. Mereka cenderung menyukai metode pembelajaran yang melibatkan penglihatan dan representasi visual.",
    characteristics: [
      "Mudah mengingat informasi jika melihatnya secara visual",
      "Suka membaca dan melihat grafik/tabel",
      "Lebih suka presentasi yang berisi gambar daripada hanya teks",
      "Cepat bosan saat hanya mendengarkan ceramah tanpa visual",
    ],
    tips: [
      "Gunakan peta konsep atau mind map untuk mereview materi",
      "Gunakan warna saat mencatat agar lebih mudah diingat",
      "Tonton video edukasi atau animasi pembelajaran",
      "Buat flashcard dengan simbol dan gambar untuk hafalan",
    ],
    icon: <BookOpen className="w-8 h-8" />,
  },

  3: {
    name: "Kinestetik",
    description:
      "Pembelajar kinestetik adalah individu yang belajar paling baik melalui pengalaman langsung dan aktivitas fisik. Mereka cenderung menyukai metode pembelajaran yang melibatkan gerakan, praktik, atau simulasi.",
    characteristics: [
      "Lebih cepat memahami konsep saat bisa langsung mempraktikkannya",
      "Suka melakukan eksperimen atau uji coba langsung",
      "Cenderung gelisah saat harus duduk terlalu lama",
      "Belajar lebih baik ketika bisa menyentuh atau merasakan objek",
    ],
    tips: [
      "Lakukan simulasi langsung atau praktek lapangan",
      "Gunakan model fisik atau alat peraga saat belajar",
      "Ubah konsep abstrak menjadi aktivitas nyata",
      "Gerakkan tubuh saat menghafal (misalnya berjalan-jalan)",
    ],
    icon: <Activity className="w-8 h-8" />,
  },
};

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Gagal parsing user data", error);
      }
    }
  }, []);

  // Enhanced quiz questions
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

  // Loading Component
  const LoadingPage = ({ text = "Lagi nentuin gaya belajarmu nih..." }) => {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex flex-col items-center justify-center">
        <style jsx>{`
          @keyframes brutalBounce {
            0%,
            100% {
              transform: translateY(0px);
              animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
            }
            50% {
              transform: translateY(-40px);
              animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
            }
          }

          .brutal-bounce {
            animation: brutalBounce 1.2s infinite;
          }

          @media (min-width: 768px) {
            @keyframes brutalBounce {
              0%,
              100% {
                transform: translateY(0px);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: translateY(-50px);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }
          }

          @media (min-width: 1024px) {
            @keyframes brutalBounce {
              0%,
              100% {
                transform: translateY(0px);
                animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
              }
              50% {
                transform: translateY(-60px);
                animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
              }
            }
          }
        `}</style>

        <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 mb-8 lg:mb-12">
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-gradient-to-b from-[#FFFFFF] to-[#D9D9D9] rounded-full brutal-bounce"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>

        <p className="text-white text-xl sm:text-2xl lg:text-4xl font-bold text-center px-4 max-w-4xl leading-relaxed">
          {text}
        </p>
      </div>
    );
  };

  // Visual Learning Result Page
  const AudLearningPage = ({ onRetake }) => {
    const style = learningStyles[1];
    const confidencePercent = predictionResult?.confidence
      ? Math.round(predictionResult.confidence * 100)
      : 82;

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <style jsx>{`
          @keyframes floating {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .floating-animation {
            animation: floating 3s ease-in-out infinite;
          }
        `}</style>

        {/* Share Button - Desktop */}
        {/* <div className="absolute top-6 right-25 z-20 hidden lg:block">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Share Button - Mobile/Tablet */}
        {/* <div className="absolute top-6 right-6 z-20 lg:hidden">
          <button className="bg-white hover:bg-gray-50 text-cyan-600 px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors border border-gray-200">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Background Circle - Desktop */}
        <div className="absolute top-0 left-0 z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] overflow-hidden hidden lg:block">
          <div className="absolute w-[120%] h-[120%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-full -top-1/4 -left-1/4"></div>
        </div>

        {/* Background Circle - Mobile/Tablet - Full width at top */}
        <div className="absolute top-0 left-0 w-full h-[60vh] z-10 lg:hidden overflow-hidden">
          <div className="absolute w-[150%] h-[150%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-b-full -top-1/4 left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex container mx-auto px-6 py-12 items-center justify-center gap-8 min-h-screen">
          {/* Left Side - Character */}
          <div className="flex">
            {/* Main Character */}
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/visuall.png"
                alt="visual image"
                width={400}
                height={300}
                className="w-[500px] h-[500px] sm:w-[550px] sm:h-[550px] md:w-[699px] md:h-[600px] object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 max-w-md relative">
            {/* Header */}
            <div className="mb-8 text-right">
              <h2 className="text-cyan-600 text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-9xl font-extrabold text-black mb-6">
                Visual
              </h1>
            </div>

            <div className="flex items-center justify-end space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            {/* Description */}
            <div className="mb-8 text-right">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={onRetake}
                className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors"
              >
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden min-h-screen flex flex-col">
          {/* Top Section - Image overlaid on gradient */}
          <div className="relative h-[60vh] flex items-center justify-center">
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/visuall.png"
                alt="visual image"
                width={400}
                height={300}
                className="w-[500px] h-[500px] sm:w-[550px] sm:h-[550px] md:w-[699px] md:h-[600px] object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Section - Content */}
          <div className="flex-1 px-6 py-8 relative z-10 bg-white">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-cyan-600 text-2xl sm:text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-black mb-4">
                Visual
              </h1>
            </div>

            {/* Description */}

            <div className="flex items-center justify-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            <div className="mb-8 text-center max-w-2xl mx-auto">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Karakteristik
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Tips Belajar
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-cyan-500 mt-0.5" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center flex-col sm:flex-row max-w-md mx-auto">
              <button
                onClick={onRetake}
                className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors"
              >
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Auditory Learning Result Page
  const VisualLearningPage = ({ onRetake }) => {
    const style = learningStyles[2];
    const confidencePercent = predictionResult?.confidence
      ? Math.round(predictionResult.confidence * 100)
      : 72;

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <style jsx>{`
          @keyframes floating {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .floating-animation {
            animation: floating 3s ease-in-out infinite;
          }
        `}</style>

        {/* Share Button - Desktop */}
        {/* <div className="absolute top-6 right-25 z-20 hidden lg:block">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Share Button - Mobile/Tablet */}
        {/* <div className="absolute top-6 right-6 z-20 lg:hidden">
          <button className="bg-white hover:bg-gray-50 text-cyan-600 px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors border border-gray-200">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Background Circle - Desktop */}
        <div className="absolute top-0 left-0 z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] overflow-hidden hidden lg:block">
          <div className="absolute w-[120%] h-[120%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-full -top-1/4 -left-1/4"></div>
        </div>

        {/* Background Circle - Mobile/Tablet - Full width at top */}
        <div className="absolute top-0 left-0 w-full h-[60vh] z-10 lg:hidden overflow-hidden">
          <div className="absolute w-[150%] h-[150%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-b-full -top-1/4 left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex container mx-auto px-6 py-12 items-center justify-center gap-8 min-h-screen">
          {/* Left Side - Character */}
          <div className="flex">
            {/* Main Character */}
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/aud.png"
                alt="auditory image"
                width={800}
                height={500}
                className="w-[400px] h-[300px] sm:w-[450px] sm:h-[340px] md:w-[500px] md:h-[375px] lg:w-[600px] lg:h-[450px] xl:w-[800px] xl:h-[650px] object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 max-w-md relative">
            {/* Header */}
            <div className="mb-8 text-right">
              <h2 className="text-cyan-600 text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-9xl font-extrabold text-black mb-6">
                Auditori
              </h1>
            </div>

            <div className="flex items-center justify-end space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            {/* Description */}
            <div className="mb-8 text-right">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={onRetake}
                className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors"
              >
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:hidden min-h-screen flex flex-col">
          {/* Top Section - Image overlaid on gradient */}
          <div className="relative h-[60vh] flex items-center justify-center">
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/aud.png"
                alt="auditory image"
                width={400}
                height={300}
                className="w-[500px] h-[500px] sm:w-[550px] sm:h-[550px] md:w-[699px] md:h-[600px] object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex-1 px-6 py-8 relative z-10 bg-white">
            <div className="mb-6 text-center">
              <h2 className="text-cyan-600 text-2xl sm:text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-black mb-4">
                {style.name}
              </h1>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            <div className="mb-8 text-center max-w-2xl mx-auto">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Karakteristik
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Tips Belajar
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-cyan-500 mt-0.5" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center flex-col sm:flex-row max-w-md mx-auto">
              <button
                onClick={onRetake}
                className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors"
              >
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Kinesthetic Learning Result Page
  const KineLearningPage = ({ onRetake }) => {
    const style = learningStyles[3];
    const confidencePercent = predictionResult?.confidence
      ? Math.round(predictionResult.confidence * 100)
      : 78;

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <style jsx>{`
          @keyframes floating {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .floating-animation {
            animation: floating 3s ease-in-out infinite;
          }
        `}</style>

        {/* Share Button - Desktop */}
        {/* <div className="absolute top-6 right-25 z-20 hidden lg:block">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Share Button - Mobile/Tablet */}
        {/* <div className="absolute top-6 right-6 z-20 lg:hidden">
          <button className="bg-white hover:bg-gray-50 text-cyan-600 px-4 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg transition-colors border border-gray-200">
            <Share size={20} />
            Share
          </button>
        </div> */}

        {/* Background Circle - Desktop */}
        <div className="absolute top-0 left-0 z-10 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px] overflow-hidden hidden lg:block">
          <div className="absolute w-[120%] h-[120%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-full -top-1/4 -left-1/4"></div>
        </div>

        {/* Background Circle - Mobile/Tablet - Full width at top */}
        <div className="absolute top-0 left-0 w-full h-[60vh] z-10 lg:hidden overflow-hidden">
          <div className="absolute w-[150%] h-[150%] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-b-full -top-1/4 left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex container mx-auto px-6 py-12 items-center justify-center gap-8 min-h-screen">
          {/* Left Side - Character */}
          <div className="flex">
            {/* Main Character */}
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/kine.png"
                alt="kinestetik image"
                width={800}
                height={500}
                className="w-[400px] h-[300px] sm:w-[450px] sm:h-[340px] md:w-[500px] md:h-[375px] lg:w-[600px] lg:h-[450px] xl:w-[800px] xl:h-[650px] object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex-1 max-w-md relative">
            {/* Header */}
            <div className="mb-8 text-right">
              <h2 className="text-cyan-600 text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-7xl font-extrabold text-black mb-6">
                Kinestetik
              </h1>
            </div>

            {/* Description */}
            <div className="flex items-center justify-end space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            {/* Description */}
            <div className="mb-8 text-right">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors">
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden min-h-screen flex flex-col">
          <div className="relative h-[60vh] flex items-center justify-center">
            <div className="relative z-20 floating-animation">
              <Image
                src="/assets/kine.png"
                alt="kinestetik image"
                width={400}
                height={300}
                className="w-[500px] h-[500px] sm:w-[550px] sm:h-[550px] md:w-[699px] md:h-[600px] object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex-1 px-6 py-8 relative z-10 bg-white">
            <div className="mb-6 text-center">
              <h2 className="text-cyan-600 text-2xl sm:text-3xl font-bold mb-2">
                Gaya belajar kamu
              </h2>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-black mb-4">
                {style.name}
              </h1>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg text-gray-600">
                Tingkat Kepercayaan: {confidencePercent}%
              </span>
            </div>

            <div className="mb-8 text-center max-w-2xl mx-auto">
              <p className="text-[#A4A4A4] text-lg font-semibold leading-relaxed">
                {style.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Karakteristik
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.characteristics.map((char, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <span className="text-gray-600">{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Tips Belajar
              </h3>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                {style.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Brain className="w-5 h-5 text-cyan-500 mt-0.5" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4 justify-center flex-col sm:flex-row max-w-md mx-auto">
              <button
                onClick={onRetake}
                className="px-8 py-3 border-2 border-cyan-500 text-cyan-600 rounded-full font-medium hover:bg-cyan-50 transition-colors"
              >
                Tes Ulang
              </button>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors shadow-lg">
                  Ke Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // API functions
  const submitStoryPrediction = async (story) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ml/predict/story`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ story }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memproses cerita");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saat memprediksi dari cerita:", error);
      throw error;
    }
  };

  const submitQuizPrediction = async (answers) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ml/predict/quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal memproses jawaban quiz");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saat memprediksi dari quiz:", error);
      throw error;
    }
  };

  // Quiz handling functions
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
      console.log("Submitting quiz answers:", quizAnswers);
      const result = await submitQuizPrediction(quizAnswers);
      console.log("Quiz prediction result:", result);
      setPredictionResult(result);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage("result");
      }, 2000);
    } catch (err) {
      console.error("Quiz submit error:", err);
      setError(err.message || "Terjadi kesalahan saat mengirim jawaban.");
      setIsLoading(false);
      setCurrentPage("quiz");
    }
  };

  const handleStorySubmit = async () => {
    setIsLoading(true);
    setError("");
    setCurrentPage("loading");
    try {
      console.log("Submitting story:", storyAnswer);
      const result = await submitStoryPrediction(storyAnswer);
      console.log("Story prediction result:", result);
      setPredictionResult(result);
      setTimeout(() => {
        setIsLoading(false);
        setCurrentPage("result");
      }, 2000);
    } catch (err) {
      console.error("Story submit error:", err);
      setError(err.message || "Terjadi kesalahan saat mengirim cerita.");
      setIsLoading(false);
      setCurrentPage("story-intro");
    }
  };

  const handleRetakeTest = () => {
    setCurrentQuestion(0);
    setQuizAnswers({});
    setStoryAnswer("");
    setPredictionResult(null);
    setError("");
    setCurrentPage("welcome");
  };

  // // Test function untuk development (hapus setelah tidak diperlukan)
  const handleTestResult = (learningStyle) => {
    setPredictionResult({
      learning_style: learningStyle,
      confidence: 0.85,
      message: "Test result",
    });
    setCurrentPage("result");
  };

  // Render result page based on learning style
  const renderResultPage = () => {
    if (!predictionResult) {
      console.log("No prediction result found");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              Tidak ada hasil prediksi.
            </div>
            <button
              onClick={handleRetakeTest}
              className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors"
            >
              Ulangi Tes
            </button>
          </div>
        </div>
      );
    }

    console.log("Prediction result:", predictionResult);

    const learningStyleValue =
      predictionResult.learning_style ||
      predictionResult.predicted_learning_style;
    console.log("Learning style value:", learningStyleValue);

    switch (learningStyleValue) {
      case 1:
        return <VisualLearningPage onRetake={handleRetakeTest} />;
      case 2:
        return <AudLearningPage onRetake={handleRetakeTest} />;
      case 3:
        return <KineLearningPage onRetake={handleRetakeTest} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">
                Gaya belajar tidak dikenali: {learningStyleValue}
              </div>
              <div className="text-gray-600 mb-4">
                Prediction result: {JSON.stringify(predictionResult)}
              </div>
              <button
                onClick={handleRetakeTest}
                className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors"
              >
                Ulangi Tes
              </button>
            </div>
          </div>
        );
    }
  };

  const renderWelcomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col p-6">
      <div className="mb-8">
        <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full hover:opacity-80 transition-opacity shadow-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center max-w-4xl w-full">
          <div className="mb-8">
            <Brain className="w-20 h-20 text-cyan-600 mx-auto mb-6" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Hai, {user?.name || "Pengguna"}!
          </h1>
          <h2 className="text-4xl font-bold text-cyan-600 mb-8">
            Ayo Tes Gaya Belajar Kamu
          </h2>
          <p className="text-gray-600 text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
            Temukan gaya belajar yang paling cocok untuk Anda! Pilih salah satu
            metode tes di bawah ini untuk mengetahui preferensi belajar Anda.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <BookOpen className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
              <button
                onClick={() => setCurrentPage("story-intro")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 rounded-full text-xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 mb-4 shadow-lg"
              >
                Tes Bercerita
              </button>
              <p className="text-gray-600 text-lg">
                Ceritakan pengalaman dan kebiasaan belajar Anda, lalu AI akan
                menganalisis gaya belajar Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <Users className="w-12 h-12 text-cyan-600 mx-auto mb-6" />
              <button
                onClick={() => setCurrentPage("quiz-intro")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 rounded-full text-xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 mb-4 shadow-lg"
              >
                Tes Quiz
              </button>
              <p className="text-gray-600 text-lg">
                Jawab pertanyaan singkat dengan skala 1-4 untuk menentukan gaya
                belajar Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStoryPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col p-6">
      <div>
        <button
          onClick={() => setCurrentPage("welcome")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full hover:opacity-80 transition-opacity shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex-1 mt-8">
        <div className="text-center mb-8">
          <BookOpen className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hai, {user?.name || "Pengguna"}!
          </h1>
          <h2 className="text-3xl font-bold text-cyan-600 mb-6">
            Kira-kira bagaimana biasanya kamu belajar?
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <p className="text-gray-600 text-xl leading-relaxed max-w-3xl">
              Kamu bisa ceritakan pengalaman kamu saat belajar, hal yang kamu
              suka saat belajar, bahkan kebiasaan unik yang kamu lakukan untuk
              belajar. Tuangkan semua di bawah ini ya!
            </p>
            <button
              onClick={() => setShowInfoPopup(true)}
              className="text-white hover:text-cyan-100 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-3 rounded-full transition-colors shadow-lg"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <textarea
            value={storyAnswer}
            onChange={(e) => setStoryAnswer(e.target.value)}
            placeholder="Ceritakan pengalaman belajar kamu di sini... (minimal 50 karakter)"
            className="w-full h-64 p-6 border-2 border-gray-200 rounded-xl resize-none focus:border-cyan-500 focus:outline-none text-gray-700 text-lg"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {storyAnswer.length}/2000 karakter
            </span>
            <span className="text-sm text-gray-500">Minimal: 50 karakter</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleStorySubmit}
            disabled={
              !storyAnswer.trim() || storyAnswer.trim().length < 50 || isLoading
            }
            className={`${
              !storyAnswer.trim() || storyAnswer.trim().length < 50 || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            } text-white py-4 px-16 rounded-full text-xl font-bold`}
          >
            {isLoading ? "Memproses..." : "Submit Cerita"}
          </button>
        </div>
      </div>

      {showInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Contoh Cerita Belajar
            </h3>
            <div className="text-gray-600 space-y-4 text-lg">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="italic">
                  &quot;Saya biasanya belajar sambil mendengarkan musik instrumental
                  karena membantu saya fokus...&quot;
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="italic">
                  &quot;Ketika belajar matematika, saya suka membuat catatan
                  berwarna-warni dan diagram...&quot;
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="italic">
                  &quot;Saya lebih mudah memahami materi ketika bisa mempraktikkannya
                  langsung...&quot;
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfoPopup(false)}
              className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 text-white py-3 rounded-full text-lg font-semibold shadow-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuizIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col p-6">
      <div>
        <button
          onClick={() => setCurrentPage("welcome")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full hover:opacity-80 transition-opacity shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex-1 mt-8">
        <div className="text-center">
          <Users className="w-16 h-16 text-cyan-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Hai, {user?.name || "Pengguna"}!
          </h1>
          <h2 className="text-3xl font-bold text-cyan-600 mb-8">
            Jawab beberapa pertanyaan yang terkait preferensi kamu ini ya
          </h2>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <p className="text-gray-600 text-xl mb-8 leading-relaxed">
              Akan disediakan beberapa pertanyaan tentang preferensi kamu dalam
              kehidupan sehari-hari, terutama dalam hal belajar. Kamu diminta
              untuk menjawab pertanyaan tersebut dalam skala 1-4.
            </p>

            <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-cyan-600 font-bold text-lg mb-2">
                  Sangat Tidak Setuju
                </p>
                <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div className="flex-1 mx-8">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-6 h-6 bg-red-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                  <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                </div>
                <div className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-cyan-600 font-bold text-lg mb-2">
                  Sangat Setuju
                </p>
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage("quiz")}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-white py-4 px-16 rounded-full text-xl font-bold shadow-lg"
          >
            Mulai Quiz
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
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col p-6">
        <div>
          <button
            onClick={() => setCurrentPage("quiz-intro")}
            className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white p-4 rounded-full hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-6 h-6" />
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
            <div className="bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] rounded-xl p-8 w-full max-w-4xl h-40 flex items-center justify-center mx-auto">
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

  // Show loading page
  if (currentPage === "loading") {
    return <LoadingPage />;
  }

  // Show result page
  if (currentPage === "result") {
    console.log("Rendering result page with:", predictionResult);
    return renderResultPage();
  }

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
