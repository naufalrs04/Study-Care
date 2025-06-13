"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Users,
  Clock,
  Send,
  LogOut,
  MessageCircle,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Settings,
  AlertCircle,
  CheckCircle,
  Menu,
  Plus,
  Code,
  Wifi,
  WifiOff,
  Info,
} from "lucide-react";
import { io } from "socket.io-client";

export default function RoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal-specific errors
  const [createModalError, setCreateModalError] = useState("");
  const [joinCodeModalError, setJoinCodeModalError] = useState("");
  const [passwordModalError, setPasswordModalError] = useState("");
  const [joinRoomModalError, setJoinRoomModalError] = useState("");

  // Chat state
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomMembers, setRoomMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Mobile states
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Custom alert/confirm states
  const [customAlert, setCustomAlert] = useState(null);
  const [customConfirm, setCustomConfirm] = useState(null);

  // Timer states - simplified approach
  const [roomDuration, setRoomDuration] = useState("00:00:00");
  const messagesEndRef = useRef(null);

  // Form states
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPrivate, setIsPrivateRoom] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showJoinRoomPassword, setShowJoinRoomPassword] = useState(false);
  const [pendingJoinRoom, setPendingJoinRoom] = useState(null);

  // Socket connection
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const durationIntervalRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auth functions - memoized to prevent re-renders
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  const getCurrentUser = useCallback(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }, []);

  // Custom Alert Component
  const CustomAlert = ({ alert, onClose }) => {
    if (!alert) return null;

    const getIcon = () => {
      switch (alert.type) {
        case "success":
          return <CheckCircle className="w-6 h-6 text-green-500" />;
        case "error":
          return <AlertCircle className="w-6 h-6 text-red-500" />;
        case "info":
          return <Info className="w-6 h-6 text-blue-500" />;
        default:
          return <AlertCircle className="w-6 h-6 text-gray-500" />;
      }
    };

    const getBgColor = () => {
      switch (alert.type) {
        case "success":
          return "bg-green-50 border-green-200";
        case "error":
          return "bg-red-50 border-red-200";
        case "info":
          return "bg-blue-50 border-blue-200";
        default:
          return "bg-gray-50 border-gray-200";
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div
          className={`bg-white rounded-2xl p-6 w-full max-w-sm mx-4 border-2 ${getBgColor()} shadow-2xl transform transition-all duration-300 scale-100`}
        >
          <div className="flex items-center mb-4">
            {getIcon()}
            <h3 className="ml-3 text-lg font-semibold text-gray-800">
              {alert.type === "success"
                ? "Berhasil!"
                : alert.type === "error"
                ? "Error!"
                : "Informasi"}
            </h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{alert.message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            OK
          </button>
        </div>
      </div>
    );
  };

  // Custom Confirm Component
  const CustomConfirm = ({ confirm, onConfirm, onCancel }) => {
    if (!confirm) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl transform transition-all duration-300 scale-100">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h3 className="ml-3 text-lg font-semibold text-gray-800">
              Konfirmasi
            </h3>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {confirm.message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
            >
              {confirm.confirmText || "Ya"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Custom alert function
  const showAlert = useCallback((message, type = "info") => {
    setCustomAlert({ message, type });
  }, []);

  // Custom confirm function
  const showConfirm = useCallback((message, confirmText = "Ya") => {
    return new Promise((resolve) => {
      setCustomConfirm({
        message,
        confirmText,
        onConfirm: () => {
          setCustomConfirm(null);
          resolve(true);
        },
        onCancel: () => {
          setCustomConfirm(null);
          resolve(false);
        },
      });
    });
  }, []);

  // Clear all modal errors
  const clearAllModalErrors = useCallback(() => {
    setCreateModalError("");
    setJoinCodeModalError("");
    setPasswordModalError("");
    setJoinRoomModalError("");
  }, []);

  // Helper function to format seconds to HH:MM:SS
  const formatSecondsToTime = useCallback((totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }, []);

  // Parse duration string to seconds
  const parseDurationToSeconds = useCallback((durationString) => {
    if (!durationString || durationString === "00:00:00") return 0;

    const parts = durationString.split(":");
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }, []);

  // Start timer with initial duration
  const startTimer = useCallback(
    (initialDuration) => {
      console.log("Starting timer with duration:", initialDuration);

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      let initialSeconds = parseDurationToSeconds(initialDuration);
      const startTime = Date.now();

      setRoomDuration(initialDuration);

      durationIntervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const newTotalSeconds = initialSeconds + elapsedSeconds;
        setRoomDuration(formatSecondsToTime(newTotalSeconds));
      }, 1000);
    },
    [parseDurationToSeconds, formatSecondsToTime]
  );

  // Stop timer
  const stopTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setRoomDuration("00:00:00");
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (isInitializedRef.current) return;

    const token = getAuthToken();
    if (!token) return;

    console.log("Initializing socket connection...");
    isInitializedRef.current = true;

    const socket = io("https://study-finder-be-production.up.railway.app", {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
      setIsConnected(false);
    });

    socket.on("joined_room", (data) => {
      console.log("✅ Joined room:", data);
      setCurrentRoom(data);
      setRoomInfo(data);
      setMessages([]);
      setShowSidebar(false); // Close sidebar on mobile when joining room

      if (data.duration) {
        startTimer(data.duration);
      }

      clearAllModalErrors();
      showAlert("Berhasil bergabung ke room!", "success");
    });

    socket.on("room_info_updated", (data) => {
      console.log("📋 Room info updated:", data);
      setRoomInfo(data);
    });

    socket.on("room_members", (members) => {
      setRoomMembers(members);
    });

    socket.on("room_members_updated", (data) => {
      setRoomMembers(data.members);
    });

    socket.on("online_users_updated", (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    socket.on("user_joined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.userName} bergabung`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("user_rejoined", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.userName} kembali bergabung`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("user_left", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.userName} meninggalkan room`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("user_disconnected", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.userName} terputus`,
          timestamp: data.timestamp,
        },
      ]);
    });

    socket.on("new_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("room_closed", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: `${data.message} oleh ${data.closedBy}`,
          timestamp: data.timestamp,
        },
      ]);

      setTimeout(() => {
        handleLeaveRoom();
      }, 5000);
    });

    socket.on("room_auto_closed", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          message: data.message,
          timestamp: data.timestamp,
        },
      ]);

      setTimeout(() => {
        handleLeaveRoom();
      }, 3000);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      showAlert(err.message || "Terjadi kesalahan pada koneksi", "error");
    });

    return () => {
      console.log("🧹 Cleaning up socket connection...");
      if (socket.connected) {
        socket.disconnect();
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      isInitializedRef.current = false;
    };
  }, []);

  // Check current room on mount
  useEffect(() => {
    const checkCurrentRoom = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const res = await fetch("https://study-finder-be-production.up.railway.app/api/rooms/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.currentRoom) {
          console.log(
            "👤 User has active room, waiting for socket auto-rejoin"
          );
        }
      } catch (err) {
        console.error("Error checking current room:", err);
      }
    };

    checkCurrentRoom();
  }, [getAuthToken]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch public rooms
  const fetchPublicRooms = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("https://study-finder-be-production.up.railway.app/api/rooms/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPublicRooms(data);
      } else {
        showAlert(data.message || "Gagal memuat daftar room", "error");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showAlert("Gagal memuat daftar room", "error");
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, showAlert]);

  useEffect(() => {
    fetchPublicRooms();
  }, [fetchPublicRooms]);

  // Handle join room
  const handleJoinRoom = useCallback(
    async (password = null) => {
      const roomToJoin = pendingJoinRoom || selectedRoom;
      if (!roomToJoin) return;

      setLoading(true);
      setJoinRoomModalError("");
      setPasswordModalError("");

      try {
        const token = getAuthToken();
        const requestBody = {};

        const passwordToSend = password || joinRoomPassword;
        if (passwordToSend) {
          requestBody.password = passwordToSend;
        }

        const res = await fetch(
          `https://study-finder-be-production.up.railway.app/api/rooms/${roomToJoin.id}/join`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        const data = await res.json();

        if (res.ok) {
          if (socketRef.current && isConnected) {
            socketRef.current.emit("join_room", { roomId: roomToJoin.id });
          }
          setSelectedRoom(null);
          setPendingJoinRoom(null);
          setShowPasswordModal(false);
          setJoinPassword("");
          setJoinRoomPassword("");
          clearAllModalErrors();
        } else {
          if (data.requirePassword && !passwordToSend) {
            setPendingJoinRoom(roomToJoin);
            setShowPasswordModal(true);
            setSelectedRoom(null);
            setJoinRoomModalError("");
          } else if (showPasswordModal) {
            setPasswordModalError(data.message || "Gagal bergabung ke room");
          } else {
            setJoinRoomModalError(data.message || "Gagal bergabung ke room");
          }
        }
      } catch (err) {
        console.error("Join room error:", err);
        const errorMessage = "Gagal bergabung ke room";
        if (showPasswordModal) {
          setPasswordModalError(errorMessage);
        } else {
          setJoinRoomModalError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      pendingJoinRoom,
      selectedRoom,
      joinRoomPassword,
      showPasswordModal,
      getAuthToken,
      isConnected,
      clearAllModalErrors,
    ]
  );

  // Handle leave room
  const handleLeaveRoom = useCallback(async () => {
    try {
      const token = getAuthToken();
      await fetch("https://study-finder-be-production.up.railway.app/api/rooms/leave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (socketRef.current) {
        socketRef.current.emit("leave_room");
      }

      setCurrentRoom(null);
      setRoomInfo(null);
      setMessages([]);
      setRoomMembers([]);
      setOnlineUsers(new Set());
      stopTimer();
      fetchPublicRooms();
      showAlert("Berhasil keluar dari room", "success");
    } catch (err) {
      console.error("Leave room error:", err);
      showAlert("Gagal keluar dari room", "error");
    }
  }, [getAuthToken, stopTimer, fetchPublicRooms, showAlert]);

  // Handle send message
  const handleSendMessage = useCallback(() => {
    if (
      !newMessage.trim() ||
      !currentRoom ||
      !socketRef.current ||
      !isConnected
    )
      return;

    socketRef.current.emit("send_message", {
      roomId: currentRoom.roomId,
      message: newMessage.trim(),
    });
    setNewMessage("");
  }, [newMessage, currentRoom, isConnected]);

  // Handle create room
  const handleCreateNewRoom = useCallback(async () => {
    setCreateModalError("");

    if (!roomName.trim()) {
      setCreateModalError("Nama room tidak boleh kosong");
      return;
    }

    if (isPrivate && !roomPassword.trim()) {
      setCreateModalError("Password diperlukan untuk room privat");
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("https://study-finder-be-production.up.railway.app/api/rooms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription,
          isPrivate: isPrivate,
          password: isPrivate ? roomPassword : null,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        if (socketRef.current && isConnected) {
          socketRef.current.emit("join_room", { roomId: data.room.id });
        }
        setRoomName("");
        setRoomDescription("");
        setRoomPassword("");
        setIsPrivateRoom(false);
        setShowCreateModal(false);
        clearAllModalErrors();
        fetchPublicRooms();
      } else {
        setCreateModalError(data.message || "Gagal membuat room");
      }
    } catch (err) {
      console.error("Create room error:", err);
      setCreateModalError("Gagal membuat room");
    } finally {
      setLoading(false);
    }
  }, [
    roomName,
    roomDescription,
    isPrivate,
    roomPassword,
    getAuthToken,
    isConnected,
    clearAllModalErrors,
    fetchPublicRooms,
  ]);

  // Handle join with code
  const handleJoinRoomWithCode = useCallback(
    async (password = null) => {
      setJoinCodeModalError("");
      setPasswordModalError("");

      if (!roomCode.trim()) {
        setJoinCodeModalError("Kode room tidak boleh kosong");
        return;
      }

      setLoading(true);
      try {
        const token = getAuthToken();
        const requestBody = { roomCode: roomCode.toUpperCase() };
        if (password) {
          requestBody.password = password;
        }

        const res = await fetch("https://study-finder-be-production.up.railway.app/api/rooms/join-code", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        const data = await res.json();

        if (res.ok) {
          if (socketRef.current && isConnected) {
            socketRef.current.emit("join_room", { roomId: data.roomId });
          }
          setRoomCode("");
          setJoinPassword("");
          setShowJoinCodeModal(false);
          setShowPasswordModal(false);
          clearAllModalErrors();
        } else {
          if (data.requirePassword) {
            setShowPasswordModal(true);
            setJoinCodeModalError("");
          } else if (showPasswordModal) {
            setPasswordModalError(
              data.message || "Gagal bergabung dengan kode room"
            );
          } else {
            setJoinCodeModalError(
              data.message || "Gagal bergabung dengan kode room"
            );
          }
        }
      } catch (err) {
        console.error("Join with code error:", err);
        const errorMessage = "Gagal bergabung dengan kode room";
        if (showPasswordModal) {
          setPasswordModalError(errorMessage);
        } else {
          setJoinCodeModalError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      roomCode,
      showPasswordModal,
      getAuthToken,
      isConnected,
      clearAllModalErrors,
    ]
  );

  // Handle close room
  const handleCloseRoom = useCallback(async () => {
    if (!currentRoom) return;

    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin menutup room ini? Semua member akan dikeluarkan.",
      "Tutup Room"
    );

    if (!confirmed) return;

    try {
      if (socketRef.current) {
        socketRef.current.emit("close_room", { roomId: currentRoom.roomId });
      }
    } catch (err) {
      console.error("Close room error:", err);
      showAlert("Gagal menutup room", "error");
    }
  }, [currentRoom, showConfirm, showAlert]);

  // Other handlers
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleRoomClick = useCallback((room) => {
    setSelectedRoom(room);
    setJoinRoomModalError("");
    setJoinRoomPassword("");
  }, []);

  const copyRoomCode = useCallback(() => {
    if (roomInfo?.roomCode) {
      navigator.clipboard.writeText(roomInfo.roomCode);
      showAlert("Kode room berhasil disalin!", "success");
    }
  }, [roomInfo?.roomCode, showAlert]);

  const handlePasswordSubmit = useCallback(() => {
    if (pendingJoinRoom) {
      handleJoinRoom(joinPassword);
    } else {
      handleJoinRoomWithCode(joinPassword);
    }
  }, [pendingJoinRoom, joinPassword, handleJoinRoom, handleJoinRoomWithCode]);

  // UI Event Handlers
  const handleCloseModal = useCallback(() => {
    setSelectedRoom(null);
    setJoinRoomModalError("");
    setJoinRoomPassword("");
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setRoomName("");
    setRoomDescription("");
    setRoomPassword("");
    setIsPrivateRoom(false);
    setCreateModalError("");
  }, []);

  const handleCloseJoinCodeModal = useCallback(() => {
    setShowJoinCodeModal(false);
    setRoomCode("");
    setJoinCodeModalError("");
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setShowPasswordModal(false);
    setJoinPassword("");
    setPendingJoinRoom(null);
    setPasswordModalError("");
  }, []);

  // Error Alert Component for Modals
  const ErrorAlert = ({ error, onClose }) => {
    if (!error) return null;

    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
        <span className="text-sm text-red-700 flex-1">{error}</span>
        <button
          onClick={onClose}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const currentUser = getCurrentUser();

  // Chat interface for when user is in a room
  if (currentRoom && roomInfo) {
    return (
      <div className="flex h-screen bg-gray-50 relative">
        {/* Mobile Header */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-30 flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {roomInfo.roomName}
              </h2>
            </div>
            <button
              onClick={handleLeaveRoom}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40 w-80" : "w-80"} 
          bg-white border-r border-gray-200 flex flex-col
          ${isMobile && !showSidebar ? "-translate-x-full" : "translate-x-0"}
          transition-transform duration-300 ease-in-out
        `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                {roomInfo.roomName}
                {roomInfo.isPrivate && (
                  <Lock className="w-4 h-4 ml-2 text-gray-500" />
                )}
              </h2>
              <div className="flex items-center space-x-2">
                {currentUser?.id === roomInfo.createdBy && (
                  <button
                    onClick={handleCloseRoom}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Tutup room"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                )}
                {!isMobile && (
                  <button
                    onClick={handleLeaveRoom}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Keluar dari room"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Room Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                {isConnected ? (
                  <Wifi className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 mr-2 text-red-500" />
                )}
                <span>{isConnected ? "Terhubung" : "Terputus"}</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kode Room:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-600">
                      {roomInfo.roomCode}
                    </span>
                    <button
                      onClick={copyRoomCode}
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Copy kode"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-mono font-bold text-green-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {roomDuration}
                  </span>
                </div>

                {roomInfo.roomDescription && (
                  <div>
                    <span className="text-gray-600">Deskripsi:</span>
                    <p className="text-gray-800 text-sm mt-1">
                      {roomInfo.roomDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Anggota ({roomMembers.length})
            </h3>
            <div className="space-y-2">
              {roomMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={
                        member.profile_picture
                          ? `https://study-finder-be-production.up.railway.app/uploads/avatars/${member.profile_picture}`
                          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                      }
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    {onlineUsers.has(member.id) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">
                        {member.name}
                      </span>
                      {member.id === roomInfo.createdBy && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          Creator
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col ${isMobile ? "pt-16" : ""}`}>
          {/* Desktop Chat Header */}
          {!isMobile && (
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium text-gray-800">Chat Room</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                {message.type === "system" ? (
                  <div className="text-center">
                    <span className="text-sm text-gray-500 bg-gray-100 rounded-full px-3 py-1 inline-block">
                      {message.message}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start space-x-3">
                    <img
                      src={
                        message.userAvatar
                          ? `https://study-finder-be-production.up.railway.app/uploads/avatars/${message.userAvatar}`
                          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                      }
                      alt={message.userName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {message.userName}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <p className="text-gray-700 break-words">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan..."
                className="text-black flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Alert & Confirm */}
        <CustomAlert alert={customAlert} onClose={() => setCustomAlert(null)} />
        <CustomConfirm
          confirm={customConfirm}
          onConfirm={customConfirm?.onConfirm}
          onCancel={customConfirm?.onCancel}
        />
      </div>
    );
  }

  // Main room selection interface
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Custom Alert & Confirm */}
      <CustomAlert alert={customAlert} onClose={() => setCustomAlert(null)} />
      <CustomConfirm
        confirm={customConfirm}
        onConfirm={customConfirm?.onConfirm}
        onCancel={customConfirm?.onCancel}
      />

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-white rounded-xl shadow-sm border border-blue-200 flex items-center">
        {isConnected ? (
          <Wifi className="w-5 h-5 mr-2 text-green-500" />
        ) : (
          <WifiOff className="w-5 h-5 mr-2 text-red-500" />
        )}
        <span className="text-sm font-medium text-gray-700">
          {isConnected ? "Terhubung ke server" : "Menghubungkan ke server..."}
        </span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Belajar bersama, masuk ke{" "}
            <span className="text-blue-500">Ruang Belajar</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Kamu bisa belajar bersama dengan masuk ke room yang sama dengan
            temanmu, buat room dan undang temanmu atau bergabung ke room public
            yang tersedia.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowJoinCodeModal(true)}
            disabled={loading || !isConnected}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
          >
            <Code className="w-5 h-5" />
            <span className="text-sm">Join dengan Kode</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={loading || !isConnected}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Buat Room</span>
          </button>
        </div>
      </div>

      {/* Room List */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Daftar Room
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : publicRooms.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
            {publicRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room)}
                className="bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={room.avatar}
                      alt={room.name}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                      {room.isPrivate && (
                        <Lock className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base truncate w-full">
                    {room.name}
                  </h3>
                  <p className="text-xs md:text-sm text-blue-500 mb-1">
                    {room.joined} joined
                  </p>
                  {room.duration !== "00:00:00" && (
                    <p className="text-xs text-green-600 font-mono bg-green-50 px-2 py-1 rounded-full">
                      {room.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada room tersedia saat ini.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* Modal Join Room */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              Gabung ke{" "}
              <span className="text-blue-500 ml-1">{selectedRoom.name}</span>
              {selectedRoom.isPrivate && (
                <Lock className="w-5 h-5 ml-2 text-gray-500" />
              )}
            </h2>

            <ErrorAlert
              error={joinRoomModalError}
              onClose={() => setJoinRoomModalError("")}
            />

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Deskripsi
                </h3>
                <p className="text-gray-800">{selectedRoom.description}</p>
              </div>

              {selectedRoom.isPrivate && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Password Room <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showJoinRoomPassword ? "text" : "password"}
                      placeholder="Masukkan password room"
                      value={joinRoomPassword}
                      onChange={(e) => setJoinRoomPassword(e.target.value)}
                      className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowJoinRoomPassword(!showJoinRoomPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showJoinRoomPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">
                    🔒 Room ini memerlukan password untuk masuk
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Joined
                  </h3>
                  <p className="text-blue-500 font-medium">
                    {selectedRoom.joined}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    Duration
                  </h3>
                  <p className="text-green-500 font-medium font-mono">
                    {selectedRoom.duration}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleJoinRoom()}
                disabled={
                  loading ||
                  !isConnected ||
                  (selectedRoom.isPrivate && !joinRoomPassword.trim())
                }
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? "Joining..." : "Join"}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Room */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={handleCloseCreateModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Buat Room
            </h2>

            <ErrorAlert
              error={createModalError}
              onClose={() => setCreateModalError("")}
            />

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Nama Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Deskripsi Room"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivateRoom(!isPrivate)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600 font-medium">Private Room</span>
              </label>
              {isPrivate && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password Room"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 text-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateNewRoom}
                disabled={loading || !isConnected}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? "Creating..." : "Buat"}
              </button>
              <button
                onClick={handleCloseCreateModal}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Join dengan Kode */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={handleCloseJoinCodeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Gabung dengan Kode
            </h2>

            <ErrorAlert
              error={joinCodeModalError}
              onClose={() => setJoinCodeModalError("")}
            />

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Masukkan Kode Room
                </label>
                <input
                  type="text"
                  placeholder="Contoh: ABC123"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={10}
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg font-mono tracking-wider"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tips:</strong> Minta kode room dari teman yang
                  sudah membuat room.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleJoinRoomWithCode()}
                disabled={loading || !isConnected}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? "Joining..." : "Gabung"}
              </button>
              <button
                onClick={handleCloseJoinCodeModal}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <button
              onClick={handleClosePasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2 text-blue-500" />
              Room Privat
            </h2>

            <ErrorAlert
              error={passwordModalError}
              onClose={() => setPasswordModalError("")}
            />

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Masukkan Password Room
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className="text-gray-600 w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordSubmit();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-700">
                  🔒 Room ini memerlukan password untuk masuk.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                disabled={loading || !isConnected || !joinPassword.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 transform hover:scale-105"
              >
                {loading ? "Verifying..." : "Masuk"}
              </button>
              <button
                onClick={handleClosePasswordModal}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
