"use client";
import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { io } from "socket.io-client"; // Commented for demo

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

  // Timer states - incremental approach
  const [roomDuration, setRoomDuration] = useState("00:00:00");
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(0); // Duration from database in seconds
  const [currentDurationSeconds, setCurrentDurationSeconds] = useState(0); // Current duration for display
  const [timerStartTime, setTimerStartTime] = useState(null); // When timer started locally
  const messagesEndRef = useRef(null);

  // Form states
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPrivate, setIsPrivateRoom] = useState(false);
  const [roomPassword, setRoomPassword] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinRoomPassword, setJoinRoomPassword] = useState(""); // Password for join room modal
  const [showPassword, setShowPassword] = useState(false);
  const [showJoinRoomPassword, setShowJoinRoomPassword] = useState(false);
  const [pendingJoinRoom, setPendingJoinRoom] = useState(null);

  // Socket connection
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const durationIntervalRef = useRef(null);

  // Get auth token dan user dari localStorage (hanya di client)
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  };

  // Clear all modal errors
  const clearAllModalErrors = () => {
    setCreateModalError("");
    setJoinCodeModalError("");
    setPasswordModalError("");
    setJoinRoomModalError("");
  };

  // Helper function to parse duration string (HH:MM:SS) to seconds
  const parseDurationToSeconds = (durationString) => {
    if (!durationString || durationString === "00:00:00") return 0;

    const parts = durationString.split(":");
    if (parts.length !== 3) return 0;

    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  // Helper function to format seconds to HH:MM:SS
  const formatSecondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Start incremental timer from initial duration
  const startIncrementalTimer = (initialDuration) => {
    console.log("Starting incremental timer from:", initialDuration);

    // Parse initial duration to seconds
    const initialSeconds = parseDurationToSeconds(initialDuration);
    setInitialDurationSeconds(initialSeconds);
    setCurrentDurationSeconds(initialSeconds);

    // Set timer start time to now
    const now = Date.now();
    setTimerStartTime(now);

    // Clear existing interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    // Start incremental timer
    durationIntervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - now;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const newTotalSeconds = initialSeconds + elapsedSeconds;

      setCurrentDurationSeconds(newTotalSeconds);
      setRoomDuration(formatSecondsToTime(newTotalSeconds));
    }, 1000);

    console.log("Incremental timer started");
  };

  // Stop incremental timer
  const stopIncrementalTimer = () => {
    console.log("Stopping incremental timer");
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
    setRoomDuration("00:00:00");
    setInitialDurationSeconds(0);
    setCurrentDurationSeconds(0);
    setTimerStartTime(null);
  };

  // Initialize socket connection
  useEffect(() => {
    const token = getAuthToken();
    if (token && !socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        auth: {
          token: token,
        },
      });

      // Socket event listeners
      socketRef.current.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      socketRef.current.on("joined_room", (data) => {
        console.log("Joined room:", data);
        setCurrentRoom(data);
        setRoomInfo(data);
        setMessages([]); // Clear previous messages

        // Start incremental timer from server duration
        if (data.duration) {
          console.log("Received room duration from server:", data.duration);
          startIncrementalTimer(data.duration);
        } else if (data.startedAt) {
          // Fallback: calculate duration from startedAt if duration not provided
          const now = new Date();
          const started = new Date(data.startedAt);
          const diffMs = now - started;
          const diffSeconds = Math.floor(diffMs / 1000);
          const calculatedDuration = formatSecondsToTime(diffSeconds);
          console.log(
            "Calculated duration from startedAt:",
            calculatedDuration
          );
          startIncrementalTimer(calculatedDuration);
        }

        clearAllModalErrors();
      });

      socketRef.current.on("room_info_updated", (data) => {
        setRoomInfo(data);
        // Update timer if new duration provided
        if (data.duration && !timerStartTime) {
          startIncrementalTimer(data.duration);
        }
      });

      socketRef.current.on("room_members", (members) => {
        setRoomMembers(members);
      });

      socketRef.current.on("room_members_updated", (data) => {
        setRoomMembers(data.members);
      });

      socketRef.current.on("online_users_updated", (userIds) => {
        setOnlineUsers(new Set(userIds));
      });

      socketRef.current.on("user_joined", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: `${data.userName} bergabung`,
            timestamp: data.timestamp,
          },
        ]);
      });

      socketRef.current.on("user_rejoined", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: `${data.userName} kembali bergabung`,
            timestamp: data.timestamp,
          },
        ]);
      });

      socketRef.current.on("user_left", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: `${data.userName} meninggalkan room`,
            timestamp: data.timestamp,
          },
        ]);
      });

      socketRef.current.on("user_disconnected", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: `${data.userName} terputus`,
            timestamp: data.timestamp,
          },
        ]);
      });

      socketRef.current.on("new_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socketRef.current.on("room_closed", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: `${data.message} oleh ${data.closedBy}`,
            timestamp: data.timestamp,
          },
        ]);

        // Auto leave room after 5 seconds
        setTimeout(() => {
          handleLeaveRoom();
        }, 5000);
      });

      socketRef.current.on("room_auto_closed", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            type: "system",
            message: data.message,
            timestamp: data.timestamp,
          },
        ]);

        // Auto leave room after 3 seconds
        setTimeout(() => {
          handleLeaveRoom();
        }, 3000);
      });

      socketRef.current.on("error", (err) => {
        console.error("Socket error:", err);
        setError(err.message || "Terjadi kesalahan pada koneksi");
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };
    }
  }, [timerStartTime]);

  // Check for existing room on load
  useEffect(() => {
    const checkCurrentRoom = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/rooms/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.currentRoom) {
          // User has an active room, let socket handle auto-rejoin
          console.log("User has active room, waiting for socket auto-rejoin");
        }
      } catch (err) {
        console.error("Error checking current room:", err);
      }
    };

    checkCurrentRoom();
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  // Scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch public rooms
  const fetchPublicRooms = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/rooms/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setPublicRooms(data);
      } else {
        setError(data.message || "Gagal memuat daftar room");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat daftar room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  // Handle join room - updated to handle inline password
  const handleJoinRoom = async (password = null) => {
    const roomToJoin = pendingJoinRoom || selectedRoom;
    if (!roomToJoin) return;

    setLoading(true);
    setJoinRoomModalError("");
    setPasswordModalError("");

    try {
      const token = getAuthToken();
      const requestBody = {};

      // Use inline password from join room modal if available, otherwise use separate password modal
      const passwordToSend = password || joinRoomPassword;
      if (passwordToSend) {
        requestBody.password = passwordToSend;
      }

      const res = await fetch(
        `http://localhost:5000/api/rooms/${roomToJoin.id}/join`,
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
          // If password required but not provided, show separate password modal
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
  };

  // Handle create room
  const handleCreateNewRoom = async () => {
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
      const res = await fetch("http://localhost:5000/api/rooms", {
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
  };

  // Handle join with code
  const handleJoinRoomWithCode = async (password = null) => {
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

      const res = await fetch("http://localhost:5000/api/rooms/join-code", {
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
  };

  // Handle send message
  const handleSendMessage = () => {
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
  };

  // Handle leave room
  const handleLeaveRoom = async () => {
    try {
      const token = getAuthToken();
      await fetch("http://localhost:5000/api/rooms/leave", {
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
      stopIncrementalTimer();
      fetchPublicRooms();
    } catch (err) {
      console.error("Leave room error:", err);
      setError("Gagal keluar dari room");
    }
  };

  // Handle close room
  const handleCloseRoom = async () => {
    if (
      !currentRoom ||
      !window.confirm(
        "Apakah Anda yakin ingin menutup room ini? Semua member akan dikeluarkan."
      )
    ) {
      return;
    }

    try {
      if (socketRef.current) {
        socketRef.current.emit("close_room", { roomId: currentRoom.roomId });
      }
    } catch (err) {
      console.error("Close room error:", err);
      setError("Gagal menutup room");
    }
  };

  // Copy room code
  const copyRoomCode = () => {
    if (roomInfo?.roomCode) {
      navigator.clipboard.writeText(roomInfo.roomCode);
      // You could add a toast notification here
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle password form submit
  const handlePasswordSubmit = () => {
    if (pendingJoinRoom) {
      handleJoinRoom(joinPassword);
    } else {
      handleJoinRoomWithCode(joinPassword);
    }
  };

  // UI Event Handlers
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setJoinRoomModalError("");
    setJoinRoomPassword(""); // Clear password when selecting new room
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setJoinRoomModalError("");
    setJoinRoomPassword("");
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setRoomName("");
    setRoomDescription("");
    setRoomPassword("");
    setIsPrivateRoom(false);
    setCreateModalError("");
  };

  const handleCloseJoinCodeModal = () => {
    setShowJoinCodeModal(false);
    setRoomCode("");
    setJoinCodeModalError("");
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setJoinPassword("");
    setPendingJoinRoom(null);
    setPasswordModalError("");
  };

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

  // Jika sedang di dalam room, tampilkan chat interface
  if (currentRoom && roomInfo) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Room Info & Members */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
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
                <button
                  onClick={handleLeaveRoom}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Keluar dari room"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Room Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
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
          <div className="flex-1 p-4">
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
                          ? `http://localhost:5000/uploads/avatars/${member.profile_picture}`
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium text-gray-800">Chat Room</span>
            </div>
          </div>

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
                          ? `http://localhost:5000/uploads/avatars/${message.userAvatar}`
                          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                      }
                      alt={message.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {message.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <p className="text-gray-700">{message.message}</p>
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
                className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main room selection interface
  return (
    <div className="p-6">
      {/* Error Display - hanya untuk error umum room page */}
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

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center">
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <span className="text-sm text-blue-700">
          Status:{" "}
          {isConnected ? "Terhubung ke server" : "Menghubungkan ke server..."}
        </span>
      </div>

      <div className="flex">
        <div className="flex flex-col flex-grow">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Belajar bersama, masuk ke{" "}
            <span className="text-blue-500">Ruang Belajar</span>
          </h1>
          <p className="text-gray-600 max-w-5xl">
            Kamu bisa belajar bersama dengan masuk ke room yang sama dengan
            temanmu, buat room dan undang temanmu atau bergabung ke room public
            yang tersedia.
          </p>
        </div>

        <div className="flex my-auto mx-auto gap-x-4">
          <button
            onClick={() => setShowJoinCodeModal(true)}
            disabled={loading || !isConnected}
            className="cursor-pointer bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white px-4 py-2 rounded-full transform hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors flex items-center disabled:opacity-50"
          >
            Join Room dengan Kode
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={loading || !isConnected}
            className="cursor-pointer bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white px-4 py-2 rounded-full transform hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="text-sm">+</span> Buat Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-5 p-6">
        <div className="w-full">
          <div className="flex justify-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Daftar Room
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6">
            {loading ? (
              <p>Loading room...</p>
            ) : publicRooms.length > 0 ? (
              publicRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className="bg-transparent rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img
                        src={room.avatar}
                        alt={room.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                        {room.isPrivate && (
                          <Lock className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {room.name}
                    </h3>
                    <p className="text-sm text-blue-500">
                      {room.joined} joined
                    </p>
                    {room.duration !== "00:00:00" && (
                      <p className="text-xs text-green-600 font-mono">
                        {room.duration}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-black">Tidak ada room tersedia.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Join Room - Updated with inline password for private rooms */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
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

              {/* Password field for private rooms */}
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
                      className="text-black w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

              <div className="flex justify-between">
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
                className="flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join"}
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Room */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
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
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Deskripsi Room"
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivateRoom(!isPrivate)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-600">Private Room</span>
              </label>
              {isPrivate && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password Room"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Buat"}
              </button>
              <button
                onClick={handleCloseCreateModal}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Join dengan Kode */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
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
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg font-mono tracking-wider"
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
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
                className="flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Joining..." : "Gabung"}
              </button>
              <button
                onClick={handleCloseJoinCodeModal}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Password - for join by code when private room detected */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
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
                    className="text-gray-600 w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-700">
                  🔒 Room ini memerlukan password untuk masuk.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                disabled={loading || !isConnected || !joinPassword.trim()}
                className="flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Masuk"}
              </button>
              <button
                onClick={handleClosePasswordModal}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
