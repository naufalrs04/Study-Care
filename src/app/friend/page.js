"use client";

import React, { useState, useEffect } from "react";
import {
  Info,
  UserMinus,
  UserPlus,
  Clock,
  BookOpen,
  X,
  Eye,
} from "lucide-react";

// ============= API SERVICES =============

// Get token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
const learningStyleLabels = {
  1: "Auditori",
  2: "Visual",
  3: "Kinestetik",
};
const getStyleClass = (style) => {
  switch (style) {
    case 1:
      return "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800";
    case 2:
      return "bg-gradient-to-r from-green-200 to-green-300 text-green-800";
    case 3:
      return "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800";
    default:
      return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600";
  }
};
const getLearningStyleLabel = (style) => {
  return learningStyleLabels[style] || "-";
};
// API calls
const friendAPI = {
  // Search users
  searchUsers: async (query) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/friends/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      return data.users || data;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  },

  getRecommendedFriends: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get recommendations");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  },

  // Get friends list
  getFriends: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get friends");
      const data = await response.json();
      return data.friends || data;
    } catch (error) {
      console.error("Error getting friends:", error);
      throw error;
    }
  },

  // Get friend requests
  getFriendRequests: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get friend requests");
      const data = await response.json();
      return data.requests || data;
    } catch (error) {
      console.error("Error getting friend requests:", error);
      throw error;
    }
  },

  // ✅ NEW: Get sent friend requests
  getSentFriendRequests: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/sent-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get sent requests");
      const data = await response.json();
      return data.sent_requests || data;
    } catch (error) {
      console.error("Error getting sent requests:", error);
      throw error;
    }
  },

  // ✅ NEW: Get friend detail
  getFriendDetail: async (friendId) => {
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
  },

  // Send friend request
  sendFriendRequest: async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/request`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to send friend request");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  },

  // ✅ NEW: Cancel friend request
  cancelFriendRequest: async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/cancel-request`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to cancel friend request");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error canceling friend request:", error);
      throw error;
    }
  },

  // Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!response.ok) throw new Error("Failed to accept friend request");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
  },

  // Reject friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/reject`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject friend request");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      throw error;
    }
  },

  // Unfriend
  unfriend: async (userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/unfriend`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to unfriend");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error unfriending:", error);
      throw error;
    }
  },
};

// ============= MAIN COMPONENT =============
const DaftarTeman = () => {
  const [activeTab, setActiveTab] = useState("daftar");
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk data
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Loading states
  const [loading, setLoading] = useState({
    friends: false,
    requests: false,
    sentRequests: false,
    search: false,
    recommendations: false,
    action: false,
    friendDetail: false,
  });

  // Error states
  const [error, setError] = useState("");

  // Load initial data
  useEffect(() => {
    loadFriends();
    loadFriendRequests();
    loadSentRequests();
    loadRecommendations();
  }, []);

  // Handle tab changes with hash
  useEffect(() => {
    const setTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#connect") setActiveTab("daftar");
      else if (hash === "#add") setActiveTab("rekomendasi");
      else if (hash === "#req") setActiveTab("permintaan");
    };
    setTabFromHash();
    window.addEventListener("hashchange", setTabFromHash);
    return () => window.removeEventListener("hashchange", setTabFromHash);
  }, []);

  // Handle search dengan debounce
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setLoading((prev) => ({ ...prev, search: true }));
        try {
          const results = await friendAPI.searchUsers(searchQuery.trim());
          setSearchResults(results);
        } catch (error) {
          setError("Gagal mencari teman");
          setSearchResults([]);
        } finally {
          setLoading((prev) => ({ ...prev, search: false }));
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Load functions
  const loadFriends = async () => {
    setLoading((prev) => ({ ...prev, friends: true }));
    try {
      const friendsData = await friendAPI.getFriends();
      setFriends(friendsData);
    } catch (error) {
      setError("Gagal memuat daftar teman");
    } finally {
      setLoading((prev) => ({ ...prev, friends: false }));
    }
  };

  const loadFriendRequests = async () => {
    setLoading((prev) => ({ ...prev, requests: true }));
    try {
      const requestsData = await friendAPI.getFriendRequests();
      setFriendRequests(requestsData);
    } catch (error) {
      setError("Gagal memuat permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }));
    }
  };

  const loadSentRequests = async () => {
    setLoading((prev) => ({ ...prev, sentRequests: true }));
    try {
      const sentData = await friendAPI.getSentFriendRequests();
      setSentRequests(sentData);
    } catch (error) {
      console.error("Load sent requests error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, sentRequests: false }));
    }
  };

  const loadRecommendations = async () => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    try {
      const recData = await friendAPI.getRecommendedFriends();
      setRecommendations(recData.recommendations || []);
    } catch (error) {
      console.error("Load recommendations error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, recommendations: false }));
    }
  };

  // Handler functions
  const handleAcceptRequest = async (requestId) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await friendAPI.acceptFriendRequest(requestId);
      setFriendRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );
      await loadFriends();
      alert("Permintaan pertemanan diterima!");
    } catch (error) {
      setError("Gagal menerima permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await friendAPI.rejectFriendRequest(requestId);
      setFriendRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );
      alert("Permintaan pertemanan ditolak!");
    } catch (error) {
      setError("Gagal menolak permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleUnfriend = async (userId, userName) => {
    const confirmUnfriend = window.confirm(
      `Apakah Anda yakin ingin menghapus ${userName} dari daftar teman?`
    );

    if (!confirmUnfriend) return;

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await friendAPI.unfriend(userId);
      setFriends((prev) => prev.filter((friend) => friend.id !== userId));
      alert(`${userName} telah dihapus dari daftar teman!`);
    } catch (error) {
      setError("Gagal menghapus pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleSendFriendRequest = async (userId) => {
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await friendAPI.sendFriendRequest(userId);

      // Update search results
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, friendship_status: "request_sent" }
            : user
        )
      );

      // Update recommendations
      setRecommendations((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, friendship_status: "request_sent" }
            : user
        )
      );

      await loadSentRequests();
      alert("Permintaan pertemanan berhasil dikirim!");
    } catch (error) {
      setError("Gagal mengirim permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCancelRequest = async (userId, userName) => {
    const confirmCancel = window.confirm(
      `Apakah Anda yakin ingin membatalkan permintaan pertemanan ke ${userName}?`
    );

    if (!confirmCancel) return;

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      await friendAPI.cancelFriendRequest(userId);
      setSentRequests((prev) => prev.filter((req) => req.id !== userId));

      // Update other states if needed
      setSearchResults((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, friendship_status: "not_friend" }
            : user
        )
      );

      setRecommendations((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, friendship_status: "not_friend" }
            : user
        )
      );

      alert("Permintaan pertemanan berhasil dibatalkan!");
    } catch (error) {
      setError("Gagal membatalkan permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleViewFriendDetail = async (friendId) => {
    setLoading((prev) => ({ ...prev, friendDetail: true }));
    try {
      const friendDetail = await friendAPI.getFriendDetail(friendId);
      setSelectedFriend(friendDetail);
    } catch (error) {
      setError("Gagal memuat detail teman");
    } finally {
      setLoading((prev) => ({ ...prev, friendDetail: false }));
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 menit";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
  };

  const getStudyStatus = (friend) => {
    if (friend.is_currently_studying && friend.current_study_title) {
      return {
        text: `Sedang belajar: ${friend.current_study_title}`,
        color: "text-green-600",
        icon: <BookOpen size={12} className="inline mr-1" />,
      };
    }
    return {
      text: "Tidak sedang belajar",
      color: "text-gray-500",
      icon: <Clock size={12} className="inline mr-1" />,
    };
  };

  // Friend Detail Modal Component
  const FriendDetailModal = ({ friend, onClose }) => {
    if (!friend) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
        {" "}
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Detail Teman</h2>
              <button
                onClick={onClose}
                className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-start space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  {friend.profile_picture ? (
                    <img
                      src={friend.profile_picture}
                      alt={friend.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl font-medium">
                      {friend.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {friend.name}
                </h3>
                <p className="text-gray-600 mb-2">{friend.email}</p>
                {friend.learning_style && (
                  <span
                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStyleClass(
                      friend.learning_style
                    )}`}
                  >
                    {getLearningStyleLabel(friend?.learning_style)}
                  </span>
                )}
                {friend.bio && (
                  <p className="text-gray-700 mt-3">{friend.bio}</p>
                )}
                {friend.interest && (
                  <p className="text-blue-600 mt-2">
                    <strong>Minat:</strong> {friend.interest}
                  </p>
                )}
              </div>
            </div>

            {/* Friendship Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">
                Info Pertemanan
              </h4>
              <div className="text-sm text-blue-700">
                <p>
                  Berteman sejak:{" "}
                  {new Date(friend.friend_since).toLocaleDateString("id-ID")}
                </p>
                <p>
                  Bergabung:{" "}
                  {new Date(friend.joined_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            {/* Current Study */}
            {friend.current_study && (
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  Sedang Belajar
                </h4>
                <p className="text-green-700 font-medium">
                  {friend.current_study.title}
                </p>
                <p className="text-sm text-green-600">
                  Durasi:{" "}
                  {formatDuration(
                    friend.current_study.current_duration_minutes
                  )}
                </p>
              </div>
            )}

            {/* Study Statistics */}
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-purple-800 mb-3">
                Statistik Belajar
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {friend.study_stats.total_sessions}
                  </div>
                  <div className="text-sm text-purple-700">Total Sesi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {friend.study_stats.total_study_hours}h
                  </div>
                  <div className="text-sm text-purple-700">Total Jam</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {friend.study_stats.today_sessions}
                  </div>
                  <div className="text-sm text-purple-700">Hari Ini</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {friend.study_stats.week_sessions}
                  </div>
                  <div className="text-sm text-purple-700">Minggu Ini</div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            {friend.recent_sessions && friend.recent_sessions.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Sesi Belajar Terbaru
                </h4>
                <div className="space-y-2">
                  {friend.recent_sessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">{session.title}</span>
                      <div className="text-gray-500">
                        {session.duration_minutes ? (
                          <span>
                            {formatDuration(session.duration_minutes)}
                          </span>
                        ) : (
                          <span className="text-green-600">Berlangsung</span>
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
    );
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError("")}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b-0 bg-white/50 backdrop-blur-sm">
          <a
            href="#connect"
            onClick={() => setActiveTab("daftar")}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "daftar"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90"
            }`}
          >
            Daftar Teman ({friends.length})
          </a>
          <a
            href="#add"
            onClick={() => setActiveTab("rekomendasi")}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "rekomendasi"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90"
            }`}
          >
            Rekomendasi
          </a>
          <a
            href="#req"
            onClick={() => setActiveTab("permintaan")}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "permintaan"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90"
            }`}
          >
            Permintaan ({friendRequests.length})
          </a>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "daftar" && (
            <div className="space-y-4">
              {loading.friends ? (
                <div className="text-center text-gray-500 mt-8">
                  Loading daftar teman...
                </div>
              ) : friends.length > 0 ? (
                friends.map((friend) => {
                  const studyStatus = getStudyStatus(friend);
                  return (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative group">
                          <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300">
                            {friend.profile_picture ? (
                              <img
                                src={friend.profile_picture}
                                alt={friend.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium">
                                {friend.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          {friend.is_currently_studying && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {friend.name}
                          </h3>
                          {friend.learning_style && (
                            <span
                              className={`inline-block px-3 text-sm font-medium rounded-full ${getStyleClass(
                                friend.learning_style
                              )}`}
                            >
                              {learningStyleLabels[friend.learning_style]}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {friend.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1">
                        <p
                          className={`text-sm ${studyStatus.color} flex items-center`}
                        >
                          {studyStatus.icon}
                          {studyStatus.text}
                        </p>
                        {friend.friend_since && (
                          <span className="text-xs text-gray-400">
                            Berteman sejak{" "}
                            {new Date(friend.friend_since).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewFriendDetail(friend.id)}
                          disabled={loading.friendDetail}
                          className="cursor-pointer p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleUnfriend(friend.id, friend.name)}
                          disabled={loading.action}
                          className="cursor-pointer p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                          title="Hapus Teman"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  Belum ada teman
                </div>
              )}
            </div>
          )}

          {activeTab === "rekomendasi" && (
            <div className="py-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Cari Teman
                </h3>
              </div>

              {/* Search Input */}
              <div className="flex items-center space-x-3 max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Masukkan nama (minimal 2 karakter)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white">
                  {loading.search ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 text-center">
                    Hasil Pencarian "{searchQuery}"
                  </h4>
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative group">
                            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300">
                              {user.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {user.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            {user.learning_style && (
                              <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                                {user.learning_style}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {user.friendship_status === "friend" ? (
                            <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">
                              Teman
                            </span>
                          ) : user.friendship_status === "request_sent" ? (
                            <button
                              onClick={() =>
                                handleCancelRequest(user.id, user.name)
                              }
                              disabled={loading.action}
                              className="px-3 py-2 bg-orange-100 text-orange-600 text-sm rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                            >
                              {loading.action ? "Loading..." : "Batalkan"}
                            </button>
                          ) : user.friendship_status === "request_received" ? (
                            <span className="px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg">
                              Request Masuk
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              disabled={loading.action}
                              className="cursor-pointer p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                              title="Tambah Teman"
                            >
                              <UserPlus size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      Akun yang kamu cari tidak ada, nih
                    </div>
                  )}
                </div>
              )}

              {searchQuery.length === 0 && !loading.recommendations ? (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800 text-center">
                    Rekomendasi Teman
                  </h4>
                  <p className="text-gray-500 text-center">
                    Teman dengan minat dan gaya belajar yang sama
                  </p>
                  {recommendations.length > 0 ? (
                    recommendations.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative group">
                            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300">
                              {user.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {user.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            {user.learning_style && (
                              <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                                {user.learning_style}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {user.friendship_status === "friend" ? (
                            <span className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg">
                              Teman
                            </span>
                          ) : user.friendship_status === "request_sent" ? (
                            <button
                              onClick={() =>
                                handleCancelRequest(user.id, user.name)
                              }
                              disabled={loading.action}
                              className="px-3 py-2 bg-orange-100 text-orange-600 text-sm rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                            >
                              {loading.action ? "Loading..." : "Batalkan"}
                            </button>
                          ) : user.friendship_status === "request_received" ? (
                            <span className="px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg">
                              Request Masuk
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              disabled={loading.action}
                              className="cursor-pointer p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                              title="Tambah Teman"
                            >
                              <UserPlus size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-8">
                      Tidak ada rekomendasi tersedia
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {activeTab === "permintaan" && (
            <div className="space-y-6">
              {/* Received Requests */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Permintaan Masuk ({friendRequests.length})
                </h3>
                {loading.requests ? (
                  <div className="text-center text-gray-500 mt-8">
                    Loading permintaan pertemanan...
                  </div>
                ) : friendRequests.length > 0 ? (
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div
                        key={request.request_id || request.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative group">
                            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300">
                              {request.profile_picture ? (
                                <img
                                  src={request.profile_picture}
                                  alt={request.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {request.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {request.name}
                            </h3>
                            {request.learning_style && (
                              <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                                {request.learning_style}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {request.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <p className="text-sm text-blue-400">
                            {request.status ||
                              request.message ||
                              "Ingin berteman dengan Anda"}
                          </p>
                          {request.requested_at && (
                            <span className="text-xs text-gray-400">
                              {new Date(
                                request.requested_at
                              ).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleAcceptRequest(request.request_id)
                            }
                            disabled={loading.action}
                            className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {loading.action ? "Loading..." : "Terima"}
                          </button>

                          <button
                            onClick={() =>
                              handleRejectRequest(request.request_id)
                            }
                            disabled={loading.action}
                            className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {loading.action ? "Loading..." : "Tolak"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    Tidak ada permintaan pertemanan masuk
                  </div>
                )}
              </div>

              {/* Sent Requests */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Permintaan Terkirim ({sentRequests.length})
                </h3>
                {loading.sentRequests ? (
                  <div className="text-center text-gray-500 mt-8">
                    Loading permintaan terkirim...
                  </div>
                ) : sentRequests.length > 0 ? (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <div
                        key={request.request_id || request.id}
                        className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative group">
                            <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-3 ring-white group-hover:ring-orange-200 transition-all duration-300">
                              {request.profile_picture ? (
                                <img
                                  src={request.profile_picture}
                                  alt={request.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {request.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {request.name}
                            </h3>
                            {request.learning_style && (
                              <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                                {request.learning_style}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {request.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <p className="text-sm text-orange-500">
                            Menunggu konfirmasi
                          </p>
                          {request.requested_at && (
                            <span className="text-xs text-gray-400">
                              Dikirim{" "}
                              {new Date(
                                request.requested_at
                              ).toLocaleDateString("id-ID")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleCancelRequest(request.id, request.name)
                            }
                            disabled={loading.action}
                            className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {loading.action ? "Loading..." : "Batalkan"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    Tidak ada permintaan pertemanan terkirim
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Friend Detail Modal */}
        {selectedFriend && (
          <FriendDetailModal
            friend={selectedFriend}
            onClose={() => setSelectedFriend(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DaftarTeman;
