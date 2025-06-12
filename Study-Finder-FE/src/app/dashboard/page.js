"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Image from "next/image";

const DashboardSection = () => {
  const [title, setTitle] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [user, setUser] = useState(null);
  // Data untuk chart statistik belajar
  const statistikData = [
    { month: "Jan", value: 45, color: "#B8E6F0" },
    { month: "Feb", value: 70, color: "#0798C5" },
    { month: "Mar", value: 32, color: "#B8E6F0" },
    { month: "Apr", value: 52, color: "#0798C5" },
    { month: "May", value: 65, color: "#B8E6F0" },
    { month: "Jun", value: 25, color: "#0798C5" },
  ];

  useEffect(() => {
    // Ambil user dari localStorage saat client sudah ready
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchActiveSession(parsedUser.id);
    }
  }, []);

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

  const addStudySession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, userId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Sesi belajar dimulai!");
        setTitle("");
        fetchActiveSession(user.id);
      } else {
        alert(data.message || "Gagal memulai sesi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const endStudySession = async () => {
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
      } else {
        alert(data.message || "Gagal mengakhiri sesi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <section id="dashboard-page" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A90A4] mb-6">
            Good Morning, Aditya!
          </h1>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-300 rounded-xl h-20"></div>
            <div className="bg-gray-300 rounded-xl h-20"></div>
            <div className="bg-gray-300 rounded-xl h-20"></div>
          </div>
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
                    />
                  </div>
                  <div>
                    <span className="text-8xl font-bold">13</span>
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
                      domain={[0, 80]}
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
                <div className="space-y-4 text-black/80">
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
                    onClick={addStudySession}
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
                </div>
              ) : (
                <div className="space-y-4 text-black/80">
                  <p className="text-gray-700">
                    Sedang belajar:{" "}
                    <strong className="text-[#0798C5]">
                      {activeSession.title}
                    </strong>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={endStudySession}
                      className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      AKHIRI
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Teman Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-700 mb-6">Teman</h3>
              <div className="space-y-4">
                {/* Friend circles - placeholder */}
                <div className="flex space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Tips Belajar */}
            <div className="bg-gradient-to-br from-[#E8F8FC] to-[#B8E6F0] rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-700 mb-4">
                Tips Belajar
              </h3>
              <div className="bg-white bg-opacity-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  💡 Cobalah teknik Pomodoro: Belajar selama 25 menit, lalu
                  istirahat 5 menit. Metode ini terbukti meningkatkan fokus dan
                  produktivitas belajar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
