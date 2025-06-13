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
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Heart,
  Sparkles,
} from "lucide-react";

// ============= ENHANCED ALERT COMPONENT =============
const Alert = ({ type, message, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const alertTypes = {
    success: {
      bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
      border: "border-emerald-200",
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      textColor: "text-emerald-800",
      closeColor: "text-emerald-500 hover:text-emerald-700",
      shadow: "shadow-emerald-100",
    },
    error: {
      bg: "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50",
      border: "border-red-200",
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      textColor: "text-red-800",
      closeColor: "text-red-500 hover:text-red-700",
      shadow: "shadow-red-100",
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
      border: "border-amber-200",
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      textColor: "text-amber-800",
      closeColor: "text-amber-500 hover:text-amber-700",
      shadow: "shadow-amber-100",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50",
      border: "border-blue-200",
      icon: <Info className="w-6 h-6 text-blue-600" />,
      textColor: "text-blue-800",
      closeColor: "text-blue-500 hover:text-blue-700",
      shadow: "shadow-blue-100",
    },
  };

  const alertStyle = alertTypes[type] || alertTypes.info;

  return (
    <div className="fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out animate-slide-in-bounce">
      <div
        className={`flex items-start p-5 rounded-2xl shadow-2xl border-2 ${alertStyle.bg} ${alertStyle.border} ${alertStyle.shadow} backdrop-blur-md max-w-sm min-w-80`}
      >
        <div className="flex-shrink-0 mr-4 mt-0.5">{alertStyle.icon}</div>
        <div className="flex-1">
          <div
            className={`${alertStyle.textColor} font-semibold text-sm leading-relaxed`}
          >
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          className={`ml-3 p-2 rounded-full transition-all duration-200 ${alertStyle.closeColor} hover:bg-white/50`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============= CONFIRMATION MODAL =============
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  type = "warning", // warning, danger, info
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-amber-500" />,
      confirmBtn:
        "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
      iconBg: "bg-amber-100",
    },
    danger: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      confirmBtn:
        "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
      iconBg: "bg-red-100",
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      confirmBtn:
        "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
      iconBg: "bg-blue-100",
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-modal-appear">
        <div className="p-8 text-center">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 ${style.iconBg} rounded-full mb-6`}
          >
            {style.icon}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3 text-white ${style.confirmBtn} rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= SUCCESS MODAL =============
const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-modal-appear">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

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

const learningStyleColors = {
  1: {
    // Auditori
    bg: "bg-gradient-to-r from-blue-400 to-blue-600",
    text: "text-white font-semibold",
    hover: "hover:from-blue-500 hover:to-blue-700",
  },
  2: {
    // Visual
    bg: "bg-gradient-to-r from-purple-400 to-purple-600",
    text: "text-white font-semibold",
    hover: "hover:from-purple-500 hover:to-purple-700",
  },
  3: {
    // Kinestetik
    bg: "bg-gradient-to-r from-green-400 to-green-600",
    text: "text-white font-semibold",
    hover: "hover:from-green-500 hover:to-green-700",
  },
  default: {
    bg: "bg-gradient-to-r from-gray-400 to-gray-600",
    text: "text-white font-semibold",
    hover: "hover:from-gray-500 hover:to-gray-700",
  },
};

const getStyleClass = (style) => {
  const colors = learningStyleColors[style] || learningStyleColors.default;
  return `${colors.bg} ${colors.text} px-3 py-1 text-xs rounded-full shadow-sm transition-all duration-300 ${colors.hover}`;
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
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // State untuk data
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
    confirmText: "Ya",
    cancelText: "Batal",
  });

  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

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

  // Show alert function
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // Show confirmation modal
  const showConfirmModal = (
    title,
    message,
    onConfirm,
    type = "warning",
    confirmText = "Ya",
    cancelText = "Batal"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type,
      confirmText,
      cancelText,
    });
  };

  // Show success modal
  const showSuccessModal = (title, message) => {
    setSuccessModal({
      isOpen: true,
      title,
      message,
    });
  };

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
          showAlert("error", "Gagal mencari teman");
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
      showAlert("error", "Gagal memuat daftar teman");
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
      showAlert("error", "Gagal memuat permintaan pertemanan");
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
      showSuccessModal(
        "Permintaan Diterima! 🎉",
        "Selamat! Kamu berhasil menambah teman baru. Sekarang kalian bisa belajar bersama!"
      );
    } catch (error) {
      showAlert("error", "Gagal menerima permintaan pertemanan");
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
      showAlert("info", "Permintaan pertemanan ditolak");
    } catch (error) {
      showAlert("error", "Gagal menolak permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleUnfriend = async (userId, userName) => {
    showConfirmModal(
      "Hapus Pertemanan",
      `Apakah kamu yakin ingin menghapus ${userName} dari daftar teman? Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        setLoading((prev) => ({ ...prev, action: true }));
        try {
          await friendAPI.unfriend(userId);
          setFriends((prev) => prev.filter((friend) => friend.id !== userId));
          showSuccessModal(
            "Pertemanan Dihapus",
            `${userName} telah dihapus dari daftar teman kamu.`
          );
        } catch (error) {
          showAlert("error", "Gagal menghapus pertemanan");
        } finally {
          setLoading((prev) => ({ ...prev, action: false }));
        }
      },
      "danger",
      "Hapus",
      "Batal"
    );
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
      showSuccessModal(
        "Permintaan Terkirim! 📤",
        "Permintaan pertemanan berhasil dikirim. Tunggu sampai mereka menerima permintaan kamu!"
      );
    } catch (error) {
      showAlert("error", "Gagal mengirim permintaan pertemanan");
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  };

  const handleCancelRequest = async (userId, userName) => {
    showConfirmModal(
      "Batalkan Permintaan",
      `Apakah kamu yakin ingin membatalkan permintaan pertemanan ke ${userName}?`,
      async () => {
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

          showAlert("info", "Permintaan pertemanan berhasil dibatalkan");
        } catch (error) {
          showAlert("error", "Gagal membatalkan permintaan pertemanan");
        } finally {
          setLoading((prev) => ({ ...prev, action: false }));
        }
      },
      "warning",
      "Batalkan",
      "Tidak"
    );
  };

  const handleViewFriendDetail = async (friendId) => {
    setLoading((prev) => ({ ...prev, friendDetail: true }));
    try {
      const friendDetail = await friendAPI.getFriendDetail(friendId);
      setSelectedFriend(friendDetail);
    } catch (error) {
      showAlert("error", "Gagal memuat detail teman");
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
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Detail Teman
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Section */}
            <div className="flex items-start space-x-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
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
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-3 border-white"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {friend.name}
                </h3>
                <p className="text-gray-600 mb-2">{friend.email}</p>
                {friend.learning_style && (
                  <span className={getStyleClass(friend.learning_style)}>
                    {getLearningStyleLabel(friend?.learning_style)}
                  </span>
                )}
                {friend.bio && (
                  <p className="text-gray-700 mt-3 italic">"{friend.bio}"</p>
                )}
                {friend.interest && (
                  <p className="text-blue-600 mt-2">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    <strong>Minat:</strong> {friend.interest}
                  </p>
                )}
              </div>
            </div>

            {/* Friendship Info */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Info Pertemanan
              </h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Berteman sejak:{" "}
                  {new Date(friend.friend_since).toLocaleDateString("id-ID")}
                </p>
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Bergabung:{" "}
                  {new Date(friend.joined_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            {/* Current Study */}
            {friend.current_study && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <BookOpen size={20} className="mr-2" />
                  Sedang Belajar
                </h4>
                <p className="text-green-700 font-medium text-lg">
                  {friend.current_study.title}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Durasi:{" "}
                  {formatDuration(
                    friend.current_study.current_duration_minutes
                  )}
                </p>
              </div>
            )}

            {/* Study Statistics */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Statistik Belajar
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {friend.study_stats.total_sessions}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Total Sesi
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {friend.study_stats.total_study_hours}h
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Total Jam
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {friend.study_stats.today_sessions}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Hari Ini
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {friend.study_stats.week_sessions}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Minggu Ini
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            {friend.recent_sessions && friend.recent_sessions.length > 0 && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Sesi Belajar Terbaru
                </h4>
                <div className="space-y-3">
                  {friend.recent_sessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                    >
                      <span className="text-gray-700 font-medium">
                        {session.title}
                      </span>
                      <div className="text-gray-500">
                        {session.duration_minutes ? (
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {formatDuration(session.duration_minutes)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
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
    );
  };

  return (
    <div className="p-6">
      <style jsx>{`
        @keyframes slide-in-bounce {
          0% {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          50% {
            transform: translateX(-10%) scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in-bounce {
          animation: slide-in-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes modal-appear {
          0% {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Alert */}
        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: "", message: "" })}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
          title={successModal.title}
          message={successModal.message}
        />

        {/* Tab Navigation */}
        <div className="flex border-b-0 bg-white/50 backdrop-blur-sm">
          <a
            href="#connect"
            onClick={() => setActiveTab("daftar")}
            className={`text-center cursor-pointer flex-1 py-6 px-8 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "daftar"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-3xl shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-95"
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Daftar Teman ({friends.length})
          </a>
          <a
            href="#add"
            onClick={() => setActiveTab("rekomendasi")}
            className={`text-center cursor-pointer flex-1 py-6 px-8 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "rekomendasi"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-3xl shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-95"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Rekomendasi
          </a>
          <a
            href="#req"
            onClick={() => setActiveTab("permintaan")}
            className={`text-center cursor-pointer flex-1 py-6 px-8 text-sm font-semibold transition-all duration-300 relative ${
              activeTab === "permintaan"
                ? "bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-3xl shadow-lg transform scale-105"
                : "text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-95"
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Permintaan ({friendRequests.length})
          </a>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "daftar" && (
            <div className="space-y-6">
              {loading.friends ? (
                <div className="text-center text-gray-500 mt-12 flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p>Loading daftar teman...</p>
                </div>
              ) : friends.length > 0 ? (
                friends.map((friend) => {
                  const studyStatus = getStudyStatus(friend);
                  return (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                    >
                      <div className="flex items-center space-x-5">
                        <div className="relative group">
                          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white group-hover:ring-blue-200 transition-all duration-300">
                            {friend.profile_picture ? (
                              <img
                                src={friend.profile_picture}
                                alt={friend.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-600 font-medium text-lg">
                                {friend.name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          {friend.is_currently_studying && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {friend.name}
                          </h3>
                          {friend.learning_style && (
                            <span
                              className={getStyleClass(friend.learning_style)}
                            >
                              {learningStyleLabels[friend.learning_style]}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            {friend.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <p
                          className={`text-sm ${studyStatus.color} flex items-center font-medium`}
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
                          className="cursor-pointer p-4 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                          title="Lihat Detail"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleUnfriend(friend.id, friend.name)}
                          disabled={loading.action}
                          className="cursor-pointer p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                          title="Hapus Teman"
                        >
                          <UserMinus size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 mt-12 flex flex-col items-center">
                  <Heart className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-lg">Belum ada teman</p>
                  <p className="text-sm">
                    Mulai cari teman baru di tab Rekomendasi!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "rekomendasi" && (
            <div className="py-6 space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-500" />
                  Cari Teman Baru
                </h3>
                <p className="text-gray-600">
                  Temukan teman dengan minat yang sama!
                </p>
              </div>

              {/* Search Input */}
              <div className="flex items-center space-x-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Masukkan nama (minimal 2 karakter)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 text-sm text-gray-700 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 placeholder-gray-400 shadow-sm"
                />
                <button className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {loading.search ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-gray-800 text-center flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Hasil Pencarian "{searchQuery}"
                  </h4>
                  {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                      >
                        <div className="flex items-center space-x-5">
                          <div className="relative group">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white group-hover:ring-blue-200 transition-all duration-300">
                              {user.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium text-lg">
                                  {user.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            {user.learning_style && (
                              <span
                                className={getStyleClass(user.learning_style)}
                              >
                                {getLearningStyleLabel(user.learning_style)}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {user.friendship_status === "friend" ? (
                            <span className="px-6 py-3 bg-green-100 text-green-700 text-sm rounded-full font-semibold flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Teman
                            </span>
                          ) : user.friendship_status === "request_sent" ? (
                            <button
                              onClick={() =>
                                handleCancelRequest(user.id, user.name)
                              }
                              disabled={loading.action}
                              className="px-6 py-3 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors disabled:opacity-50 font-semibold"
                            >
                              {loading.action ? "Loading..." : "Batalkan"}
                            </button>
                          ) : user.friendship_status === "request_received" ? (
                            <span className="px-6 py-3 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                              Request Masuk
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              disabled={loading.action}
                              className="cursor-pointer p-4 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                              title="Tambah Teman"
                            >
                              <UserPlus size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-12 flex flex-col items-center">
                      <XCircle className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-lg">
                        Akun yang kamu cari tidak ada, nih
                      </p>
                    </div>
                  )}
                </div>
              )}

              {searchQuery.length === 0 && !loading.recommendations ? (
                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-gray-800 text-center flex items-center justify-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                    Rekomendasi Teman
                  </h4>
                  <p className="text-gray-500 text-center">
                    Teman dengan minat dan gaya belajar yang sama
                  </p>
                  {recommendations.length > 0 ? (
                    recommendations.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                      >
                        <div className="flex items-center space-x-5">
                          <div className="relative group">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white group-hover:ring-blue-200 transition-all duration-300">
                              {user.profile_picture ? (
                                <img
                                  src={user.profile_picture}
                                  alt={user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium text-lg">
                                  {user.name?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            {user.learning_style && (
                              <span
                                className={getStyleClass(user.learning_style)}
                              >
                                {getLearningStyleLabel(user.learning_style)}
                              </span>
                            )}
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {user.friendship_status === "friend" ? (
                            <span className="px-6 py-3 bg-green-100 text-green-700 text-sm rounded-full font-semibold flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Teman
                            </span>
                          ) : user.friendship_status === "request_sent" ? (
                            <button
                              onClick={() =>
                                handleCancelRequest(user.id, user.name)
                              }
                              disabled={loading.action}
                              className="px-6 py-3 bg-orange-100 text-orange-700 text-sm rounded-full hover:bg-orange-200 transition-colors disabled:opacity-50 font-semibold"
                            >
                              {loading.action ? "Loading..." : "Batalkan"}
                            </button>
                          ) : user.friendship_status === "request_received" ? (
                            <span className="px-6 py-3 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                              Request Masuk
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendFriendRequest(user.id)}
                              disabled={loading.action}
                              className="cursor-pointer p-4 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md disabled:opacity-50"
                              title="Tambah Teman"
                            >
                              <UserPlus size={20} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 mt-12 flex flex-col items-center">
                      <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-lg">Tidak ada rekomendasi tersedia</p>
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
                              <span
                                className={getStyleClass(
                                  request.learning_style
                                )}
                              >
                                {getLearningStyleLabel(request.learning_style)}
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
                              <span
                                className={getStyleClass(
                                  request.learning_style
                                )}
                              >
                                {getLearningStyleLabel(request.learning_style)}
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
