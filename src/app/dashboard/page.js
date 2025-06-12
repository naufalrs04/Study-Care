"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Image from "next/image";

const DashboardSection = () => {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyStats, setStudyStats] = useState([]);
  const [friends, setFriends] = useState([]);

  // Data untuk chart statistik belajar (akan di-replace dengan data real)
  const [statistikData, setStatistikData] = useState([
    { month: "Jan", value: 45, color: "#B8E6F0" },
    { month: "Feb", value: 70, color: "#0798C5" },
    { month: "Mar", value: 32, color: "#B8E6F0" },
    { month: "Apr", value: 52, color: "#0798C5" },
    { month: "May", value: 65, color: "#B8E6F0" },
    { month: "Jun", value: 25, color: "#0798C5" },
  ]);

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
          fetchUserProfile(parsedUser.id),
          fetchActiveSession(parsedUser.id),
          fetchStudyStats(parsedUser.id),
          fetchFriends(parsedUser.id),
        ]);
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
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

  const fetchActiveSession = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study/active/${userId}`
      );
      const data = await res.json();
      if (res.ok && data.session) {
        setActiveSession(data.session);
      }
    } catch (err) {
      console.error("Gagal mengambil sesi aktif:", err);
    }
  };

  const fetchStudyStats = async (userId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study/stats/${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.stats && data.stats.length > 0) {
          // Transform data untuk chart
          const transformedData = data.stats.map((stat, index) => ({
            month: stat.month || `Month ${index + 1}`,
            value: stat.hours || stat.sessions || 0,
            color: index % 2 === 0 ? "#B8E6F0" : "#0798C5",
          }));
          setStatistikData(transformedData);
        }
      }
    } catch (err) {
      console.error("Error fetching study stats:", err);
    }
  };

  const fetchFriends = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/${userId}`,
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
      alert("Mohon masukkan judul belajar");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), userId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Sesi belajar dimulai!");
        setTitle("");
        await fetchActiveSession(user.id);
        // Update study stats after starting session
        await fetchStudyStats(user.id);
      } else {
        alert(data.message || "Gagal memulai sesi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const endStudySession = async () => {
    if (!activeSession) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeSession.id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Sesi belajar diakhiri!");
        setActiveSession(null);
        // Update study stats after ending session
        await fetchStudyStats(user.id);
        // Update user profile to refresh streak
        await fetchUserProfile(user.id);
      } else {
        alert(data.message || "Gagal mengakhiri sesi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const formatGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile?.name || user?.name || "User";

    if (hour < 12) return `Good Morning, ${name}!`;
    if (hour < 17) return `Good Afternoon, ${name}!`;
    return `Good Evening, ${name}!`;
  };

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
    if (friends.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
          <div className="flex space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
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
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200"
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
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
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
                  className="w-12 h-12 bg-gray-200 rounded-full"
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
                  {userProfile?.study_stats?.highest_streak && (
                    <p className="text-sm opacity-75 mt-2">
                      Streak terbaik: {userProfile.study_stats.highest_streak}{" "}
                      hari
                    </p>
                  )}
                </div>
                {/* Background decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
              </div>

              {/* Statistik Belajar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-6">
                  Statistik Belajar
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={statistikData}
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
                        domain={[0, "dataMax + 10"]}
                      />
                      <Bar
                        dataKey="value"
                        radius={[8, 8, 0, 0]}
                        fill={(entry, index) =>
                          statistikData[index]?.color || "#0798C5"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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
                      <p className="text-sm text-gray-500">
                        Dimulai:{" "}
                        {new Date(activeSession.created_at).toLocaleTimeString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={endStudySession}
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
  );
};

export default DashboardSection;
