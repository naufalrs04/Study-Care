"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Image from "next/image";

// Custom Modal Components
const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, onClose, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
      >
        Tutup
      </button>
    </div>
  </Modal>
);

const ErrorModal = ({ isOpen, onClose, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200"
      >
        Tutup
      </button>
    </div>
  </Modal>
);

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  type = "warning",
}) => {
  const getIconAndColors = () => {
    switch (type) {
      case "danger":
        return {
          bgColor: "bg-red-100",
          iconColor: "text-red-600",
          confirmBg: "from-red-500 to-red-600",
          confirmHover: "hover:from-red-600 hover:to-red-700",
          icon: (
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          ),
        };
      default:
        return {
          bgColor: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmBg: "from-yellow-500 to-yellow-600",
          confirmHover: "hover:from-yellow-600 hover:to-yellow-700",
          icon: (
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          ),
        };
    }
  };

  const { bgColor, iconColor, confirmBg, confirmHover, icon } =
    getIconAndColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 text-center">
        <div
          className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${bgColor} mb-6`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 bg-gradient-to-r ${confirmBg} text-white px-6 py-3 rounded-xl font-semibold ${confirmHover} transition-all duration-200`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ValidationModal = ({ isOpen, onClose, message }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
        <svg
          className="h-8 w-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Peringatan</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={onClose}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
      >
        Mengerti
      </button>
    </div>
  </Modal>
);

const DashboardSection = () => {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyStats, setStudyStats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Modal states
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });
  const [validationModal, setValidationModal] = useState({
    isOpen: false,
    message: "",
  });

  // Helper functions for modals
  const showSuccess = (title, message) => {
    setSuccessModal({ isOpen: true, title, message });
  };

  const showError = (title, message) => {
    setErrorModal({ isOpen: true, title, message });
  };

  const showValidation = (message) => {
    setValidationModal({ isOpen: true, message });
  };

  const showConfirmation = (title, message, onConfirm, type = "warning") => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });
  };

  const closeAllModals = () => {
    setSuccessModal({ isOpen: false, title: "", message: "" });
    setErrorModal({ isOpen: false, title: "", message: "" });
    setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
    setValidationModal({ isOpen: false, message: "" });
  };

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);

      // Ambil user dari localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch semua data yang diperlukan
        await Promise.all([
          fetchUserProfile(),
          fetchActiveSession(),
          fetchStudyStats(),
          fetchFriends(),
        ]);
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      showError(
        "Gagal Memuat Dashboard",
        "Terjadi kesalahan saat memuat data dashboard. Silakan refresh halaman."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchActiveSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/active-session`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setActiveSession(data.session);
          setSessionStartTime(new Date(data.session.start_time));
        }
      }
    } catch (err) {
      console.error("Gagal mengambil sesi aktif:", err);
    }
  };

  const fetchStudyStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/study-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.stats && data.stats.length > 0) {
          setStudyStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching study stats:", err);
    }
  };

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends || []);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  const addStudySession = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showValidation("Mohon masukkan judul belajar terlebih dahulu.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/start-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: title.trim(), userId: user.id }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        showSuccess(
          "Sesi Belajar Dimulai! 🎉",
          `Selamat! Kamu telah memulai sesi belajar "${title.trim()}". Tetap semangat dan fokus ya!`
        );
        setTitle("");
        await fetchActiveSession();
        await fetchStudyStats();
        await fetchUserProfile(); // Refresh profile to update streak
      } else {
        showError(
          "Gagal Memulai Sesi",
          data.message ||
            "Terjadi kesalahan saat memulai sesi belajar. Silakan coba lagi."
        );
      }
    } catch (err) {
      console.error(err);
      showError(
        "Terjadi Kesalahan",
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      );
    }
  };

  const handleEndSession = () => {
    if (!activeSession) return;

    showConfirmation(
      "Akhiri Sesi Belajar?",
      `Apakah kamu yakin ingin mengakhiri sesi belajar "${activeSession.title}"? Progres belajarmu akan tersimpan.`,
      () => endStudySession(),
      "warning"
    );
  };

  const endStudySession = async () => {
    if (!activeSession) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/end-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId: activeSession.id }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        showSuccess(
          "Sesi Belajar Selesai! 🎊",
          `Hebat! Kamu telah belajar selama ${data.duration} menit. Tetap pertahankan semangat belajarmu!`
        );
        setActiveSession(null);
        setSessionStartTime(null);
        await fetchStudyStats();
        await fetchUserProfile(); // Refresh profile to update streak and stats
      } else {
        showError(
          "Gagal Mengakhiri Sesi",
          data.message || "Terjadi kesalahan saat mengakhiri sesi belajar."
        );
      }
    } catch (err) {
      console.error(err);
      showError(
        "Terjadi Kesalahan",
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      );
    }
  };

  const formatGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile?.name || user?.name || "User";

    if (hour < 12) return `Good Morning, ${name}!`;
    if (hour < 17) return `Good Afternoon, ${name}!`;
    return `Good Evening, ${name}!`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionDuration = () => {
    if (!sessionStartTime) return "00:00";

    const now = new Date();
    const diff = Math.floor((now - sessionStartTime) / 1000); // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect for active session
  useEffect(() => {
    let interval;
    if (activeSession && sessionStartTime) {
      interval = setInterval(() => {
        // Force re-render to update timer
        setSessionStartTime(new Date(activeSession.start_time));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession, sessionStartTime]);

  const renderTopCards = () => {
    if (!userProfile) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-300 rounded-xl h-20 animate-pulse"></div>
          <div className="bg-gray-300 rounded-xl h-20 animate-pulse"></div>
          <div className="bg-gray-300 rounded-xl h-20 animate-pulse"></div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Study Hours */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Jam Belajar</p>
              <p className="text-2xl font-bold">
                {userProfile.study_stats?.total_study_hours || 0}h
              </p>
            </div>
            <div className="text-3xl opacity-80">📚</div>
          </div>
        </div>

        {/* Total Friends */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Teman</p>
              <p className="text-2xl font-bold">
                {userProfile.social_stats?.total_friends || 0}
              </p>
            </div>
            <div className="text-3xl opacity-80">👥</div>
          </div>
        </div>

        {/* Learning Style */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Gaya Belajar</p>
              <p className="text-lg font-bold">
                {userProfile.learning_style || "Belum dipilih"}
              </p>
            </div>
            <div className="text-3xl opacity-80">🎯</div>
          </div>
        </div>
      </div>
    );
  };

  const renderFriends = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (friends.length === 0) {
      return (
        <div className="text-center text-gray-500 py-4">
          <p>Belum ada teman</p>
          <p className="text-sm">Ajak teman untuk bergabung!</p>
        </div>
      );
    }

    // Group friends in rows of 3
    const friendRows = [];
    for (let i = 0; i < friends.length; i += 3) {
      friendRows.push(friends.slice(i, i + 3));
    }

    return (
      <div className="space-y-4">
        {friendRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-3">
            {row.map((friend) => (
              <div
                key={friend.id}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                title={friend.name}
              >
                {friend.avatar ? (
                  <Image
                    src={friend.avatar}
                    alt={friend.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {/* Fill remaining slots with empty circles if needed */}
            {row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
                <div
                  key={`empty-${emptyIndex}`}
                  className="w-12 h-12 bg-gray-100 rounded-full border-2 border-dashed border-gray-300"
                ></div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="dashboard-page" className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-300 rounded-xl h-20"></div>
                <div className="bg-gray-300 rounded-xl h-20"></div>
                <div className="bg-gray-300 rounded-xl h-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="dashboard-page" className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header Greeting */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#4A90A4] mb-6">
                {formatGreeting()}
              </h1>

              {/* Top Cards */}
              {renderTopCards()}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Streak Card */}
                <div className="bg-gradient-to-br from-[#7FD8E8] to-[#0798C5] rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Streak!</h2>
                    <p className="text-sm opacity-90 mb-4">
                      Kamu udah belajar berturut-turut selama :
                    </p>
                    <div className="flex items-center">
                      {/* Fire Icon */}
                      <div className="mr-4">
                        <Image
                          src="/assets/Fire.png"
                          alt="Fire"
                          width={100}
                          height={100}
                          className="drop-shadow-lg"
                        />
                      </div>
                      <div>
                        <span className="text-8xl font-bold">
                          {userProfile?.study_stats?.current_streak || 0}
                        </span>
                        <span className="text-2xl ml-2">Hari</span>
                      </div>
                    </div>
                  </div>
                  {/* Background decoration */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
                  <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
                </div>

                {/* Statistik Belajar */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-700 mb-6">
                    Statistik Belajar (Sesi per Bulan)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={studyStats}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#666" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: "#666" }}
                          domain={[0, "dataMax + 5"]}
                        />
                        <Bar
                          dataKey="value"
                          radius={[8, 8, 0, 0]}
                          fill="#0798C5"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {studyStats.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>Belum ada data statistik</p>
                      <p className="text-sm">
                        Mulai belajar untuk melihat progres!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Mulai Belajar Card */}
                <div className="bg-white rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="inline-block w-1 h-5 bg-gradient-to-r from-[#7FD8E8] to-[#0798C5] rounded-full mr-2"></span>
                    Sesi Belajar
                  </h3>
                  <p className="text-gray-600 mb-6">Belajar apa hari ini?</p>

                  {!activeSession ? (
                    <form
                      onSubmit={addStudySession}
                      className="space-y-4 text-black/80"
                    >
                      <input
                        type="text"
                        placeholder="Judul Belajar"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7FD8E8] focus:border-transparent transition-all duration-200"
                        required
                        maxLength={60}
                      />
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-to-r from-[#7FD8E8] to-[#0798C5] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#0798C5] hover:to-[#7FD8E8] transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer flex justify-center items-center gap-2"
                      >
                        <span>MULAI</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5 hidden sm:block"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4 text-black/80">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-gray-700 mb-2">
                          Sedang belajar:{" "}
                          <strong className="text-[#0798C5]">
                            {activeSession.title}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          Dimulai: {formatTime(activeSession.start_time)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleEndSession}
                          className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          AKHIRI SESI
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Teman Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-700">Teman</h3>
                    <span className="text-sm text-gray-500">
                      {friends.length} teman
                    </span>
                  </div>
                  {renderFriends()}
                </div>

                {/* Tips Belajar */}
                <div className="bg-gradient-to-br from-[#E8F8FC] to-[#B8E6F0] rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">
                    Tips Belajar
                  </h3>
                  <div className="bg-white bg-opacity-50 rounded-xl p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      💡 Cobalah teknik Pomodoro: Belajar selama 25 menit, lalu
                      istirahat 5 menit. Metode ini terbukti meningkatkan fokus
                      dan produktivitas belajar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Modals */}
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeAllModals}
        title={successModal.title}
        message={successModal.message}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeAllModals}
        title={errorModal.title}
        message={errorModal.message}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeAllModals}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      <ValidationModal
        isOpen={validationModal.isOpen}
        onClose={closeAllModals}
        message={validationModal.message}
      />
    </>
  );
};

export default DashboardSection;
