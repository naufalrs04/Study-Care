"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageCircle,
  UserPlus,
  Share2,
  MoreVertical,
  Flag,
  UserX,
  Copy,
  Check,
  BookOpen,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// Get token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// API call for friend detail
const getFriendDetail = async (friendId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/friends/${friendId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Failed to get friend detail");
    const data = await response.json();
    return data.friend;
  } catch (error) {
    console.error("Error getting friend detail:", error);
    throw error;
  }
};

export default function FriendProfilePage() {
  const params = useParams();
  const router = useRouter();
  const friendId = params?.friendId; // Assuming route is /friend-detail/[friendId]

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load friend data on component mount
  useEffect(() => {
    if (friendId) {
      loadFriendDetail();
    }
  }, [friendId]);

  const loadFriendDetail = async () => {
    setLoading(true);
    try {
      const data = await getFriendDetail(friendId);
      setFriendData(data);
    } catch (error) {
      setError("Gagal memuat detail teman");
      console.error("Load friend detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 menit";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detail teman...</p>
        </div>
      </div>
    );
  }

  if (error || !friendData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Teman tidak ditemukan"}
          </p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Main Content - Desktop: Horizontal Layout, Mobile: Vertical Layout */}
      <div className="max-w-10xl mx-auto p-4">
        {/* Mobile Layout (below lg breakpoint) */}
        <div className="lg:hidden">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-12 text-center relative">
              <div className="absolute inset-0 bg-cyan bg-opacity-10"></div>

              {/* Back Button - Mobile */}
              <button
                onClick={handleBackClick}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft
                  size={20}
                  className="text-white transition-transform duration-200 group-hover:-translate-x-1"
                />
              </button>

              {/* Profile Photo */}
              <div className="relative z-10 mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {friendData.profile_picture ? (
                    <img
                      src={friendData.profile_picture}
                      alt={friendData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                      <span className="text-cyan-600 text-2xl font-bold">
                        {friendData.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Learning Style */}
              <h2 className="text-3xl font-bold text-white mb-3">
                {friendData.name}
              </h2>
              {friendData.learning_style && (
                <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium shadow-lg">
                  {friendData.learning_style}
                </span>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-6 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {friendData.study_stats?.total_sessions || 0}
                  </div>
                  <div className="text-sm opacity-90">Sesi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {friendData.study_stats?.week_sessions || 0}
                  </div>
                  <div className="text-sm opacity-90">Minggu Ini</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {friendData.study_stats?.total_study_hours || 0}h
                  </div>
                  <div className="text-sm opacity-90">Total Jam</div>
                </div>
              </div>
            </div>

            {/* Current Study Status */}
            {friendData.current_study && (
              <div className="px-8 py-6 bg-green-50 border-b border-green-200">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <BookOpen size={18} />
                  <span className="font-medium">
                    Sedang Belajar: {friendData.current_study.title}
                  </span>
                </div>
                <div className="text-center text-sm text-green-600 mt-1">
                  Durasi:{" "}
                  {formatDuration(
                    friendData.current_study.current_duration_minutes
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex gap-4 justify-center">
                <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                  <MessageCircle size={18} />
                  <span>Kirim Pesan</span>
                </button>

                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  <span>{copied ? "Tersalin!" : "Bagikan"}</span>
                </button>
              </div>
            </div>

            {/* Bio Section */}
            {friendData.bio && (
              <div className="px-8 py-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Tentang
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
                  {friendData.bio}
                </div>
              </div>
            )}

            {/* Study Statistics */}
            <div className="px-8 py-6 bg-purple-50 border-b border-purple-200">
              <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2" />
                Statistik Belajar
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {friendData.study_stats?.total_sessions || 0}
                  </div>
                  <div className="text-sm text-purple-700">Total Sesi</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {friendData.study_stats?.total_study_hours || 0}h
                  </div>
                  <div className="text-sm text-purple-700">Total Jam</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {friendData.study_stats?.today_sessions || 0}
                  </div>
                  <div className="text-sm text-purple-700">Hari Ini</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {friendData.study_stats?.week_sessions || 0}
                  </div>
                  <div className="text-sm text-purple-700">Minggu Ini</div>
                </div>
              </div>
            </div>

            {/* Recent Study Sessions */}
            {friendData.recent_sessions &&
              friendData.recent_sessions.length > 0 && (
                <div className="px-8 py-6 bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Clock size={20} className="mr-2" />
                    Sesi Belajar Terbaru
                  </h3>
                  <div className="space-y-3">
                    {friendData.recent_sessions.map((session, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {session.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(session.start_time)}
                          </p>
                        </div>
                        <div className="text-right">
                          {session.duration_minutes ? (
                            <span className="text-blue-600 font-medium">
                              {formatDuration(session.duration_minutes)}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Berlangsung
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Additional Info */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-6">
                {friendData.learning_style && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Gaya Belajar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {friendData.learning_style}
                      </span>
                    </div>
                  </div>
                )}
                {friendData.interest && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Minat</h4>
                    <div className="flex flex-wrap gap-2">
                      {friendData.interest.split(",").map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500 space-y-1">
                <p>Berteman sejak {formatDate(friendData.friend_since)}</p>
                <p>Bergabung sejak {formatDate(friendData.joined_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout (lg and above) */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex">
              {/* Left Side - Profile Info */}
              <div className="w-1/3 bg-gradient-to-b from-cyan-400 to-blue-500 p-8 text-center relative">
                <div className="absolute inset-0 bg-cyan bg-opacity-10"></div>

                {/* Back Button - Desktop */}
                <button
                  onClick={handleBackClick}
                  className="z-99 absolute top-6 left-6 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group"
                >
                  <ArrowLeft
                    size={24}
                    className="text-white transition-transform duration-200 group-hover:-translate-x-1"
                  />
                </button>

                {/* Profile Photo */}
                <div className="relative z-10 mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {friendData.profile_picture ? (
                      <img
                        src={friendData.profile_picture}
                        alt={friendData.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                        <span className="text-cyan-600 text-2xl font-bold">
                          {friendData.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Learning Style */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  {friendData.name}
                </h2>
                {friendData.learning_style && (
                  <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium shadow-lg mb-6">
                    {friendData.learning_style}
                  </span>
                )}

                {/* Stats */}
                <div className="flex justify-center text-white mb-8 gap-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {friendData.study_stats?.total_sessions || 0}
                    </div>
                    <div className="text-sm opacity-90">Sesi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {friendData.study_stats?.week_sessions || 0}
                    </div>
                    <div className="text-sm opacity-90">Minggu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {friendData.study_stats?.total_study_hours || 0}h
                    </div>
                    <div className="text-sm opacity-90">Jam</div>
                  </div>
                </div>

                {/* Current Study */}
                {friendData.current_study && (
                  <div className="mb-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 text-white mb-2">
                      <BookOpen size={16} />
                      <span className="font-medium text-sm">
                        Sedang Belajar
                      </span>
                    </div>
                    <p className="text-white font-semibold">
                      {friendData.current_study.title}
                    </p>
                    <p className="text-white/80 text-sm">
                      {formatDuration(
                        friendData.current_study.current_duration_minutes
                      )}
                    </p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-8 space-y-6 text-left">
                  {friendData.learning_style && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        Gaya Belajar
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          {friendData.learning_style}
                        </span>
                      </div>
                    </div>
                  )}
                  {friendData.interest && (
                    <div>
                      <h4 className="font-semibold text-white mb-2">Minat</h4>
                      <div className="flex flex-wrap gap-2">
                        {friendData.interest
                          .split(",")
                          .map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              {interest.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center text-sm text-white opacity-75 space-y-1">
                  <p>Berteman sejak {formatDate(friendData.friend_since)}</p>
                  <p>Bergabung {formatDate(friendData.joined_date)}</p>
                </div>
              </div>

              {/* Right Side - Action Buttons and Content */}
              <div className="w-2/3 flex flex-col">
                {/* Action Buttons */}
                <div className="px-8 py-8 bg-white border-b border-gray-200">
                  <div className="flex gap-4 justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1">
                      <MessageCircle size={18} />
                      <span>Kirim Pesan</span>
                    </button>

                    <button
                      onClick={handleShareProfile}
                      className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      {copied ? <Check size={18} /> : <Share2 size={18} />}
                      <span>{copied ? "Tersalin!" : "Bagikan"}</span>
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  {/* Bio Section */}
                  {friendData.bio && (
                    <div className="px-8 py-6 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Tentang
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
                        {friendData.bio}
                      </div>
                    </div>
                  )}

                  {/* Study Statistics */}
                  <div className="px-8 py-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <TrendingUp size={20} className="mr-2" />
                      Statistik Belajar
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {friendData.study_stats?.total_sessions || 0}
                        </div>
                        <div className="text-sm text-purple-700">
                          Total Sesi
                        </div>
                      </div>
                      <div className="text-center bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {friendData.study_stats?.total_study_hours || 0}h
                        </div>
                        <div className="text-sm text-purple-700">Total Jam</div>
                      </div>
                      <div className="text-center bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {friendData.study_stats?.today_sessions || 0}
                        </div>
                        <div className="text-sm text-purple-700">Hari Ini</div>
                      </div>
                      <div className="text-center bg-purple-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {friendData.study_stats?.week_sessions || 0}
                        </div>
                        <div className="text-sm text-purple-700">
                          Minggu Ini
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Study Sessions */}
                  {friendData.recent_sessions &&
                    friendData.recent_sessions.length > 0 && (
                      <div className="px-8 py-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                          <Clock size={20} className="mr-2" />
                          Sesi Belajar Terbaru
                        </h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {friendData.recent_sessions.map((session, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-xl p-4 flex items-center justify-between"
                            >
                              <div>
                                <h4 className="font-medium text-gray-800">
                                  {session.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {formatDate(session.start_time)}
                                </p>
                              </div>
                              <div className="text-right">
                                {session.duration_minutes ? (
                                  <span className="text-blue-600 font-medium">
                                    {formatDuration(session.duration_minutes)}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">
                                    Berlangsung
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
