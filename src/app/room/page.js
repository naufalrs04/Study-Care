"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Clock,
  Send,
  LogOut,
  X,
  Eye,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { io } from "socket.io-client";

export default function RoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [isPrivate, setIsPrivateRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  // Room & Chat state
  const [publicRooms, setPublicRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomMembers, setRoomMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Ambil token dan user hanya di client
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  };

  // Inisialisasi socket
  useEffect(() => {
    const token = getAuthToken();
    if (token && !socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        auth: { token },
      });

      // Event listeners
      socketRef.current.on("connect", () => console.log("Connected to server"));
      socketRef.current.on("disconnect", () =>
        console.log("Disconnected from server")
      );
      socketRef.current.on("joined_room", (data) => {
        setCurrentRoom(data);
        setShowChatModal(true);
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
        setOnlineUsers((prev) => new Set([...prev, data.userId]));
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
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      });
      socketRef.current.on("new_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });
      socketRef.current.on("room_members", (members) => {
        setRoomMembers(members);
        setOnlineUsers(new Set(members.map((m) => m.id)));
      });
      socketRef.current.on("error", (err) => {
        setError(err.message || "Kesalahan pada koneksi");
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, []);

  // Scroll otomatis saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ambil daftar room publik
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
      setPublicRooms(data);
    } catch (err) {
      setError("Gagal memuat room");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  // Handle join room
  const handleJoinRoom = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(
        `http://localhost:5000/api/rooms/${selectedRoom.id}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        if (socketRef.current) {
          socketRef.current.emit("join_room", { roomId: selectedRoom.id });
        }
        setSelectedRoom(null);
      }
    } catch (err) {
      setError("Gagal bergabung ke room");
    } finally {
      setLoading(false);
    }
  };

  // Handle buat room
  const handleCreateNewRoom = async () => {
    if (!roomName.trim()) {
      setError("Nama room tidak boleh kosong");
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
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (socketRef.current) {
          socketRef.current.emit("join_room", { roomId: data.room.id });
        }
        setRoomName("");
        setRoomDescription("");
        setIsPrivateRoom(false);
        setShowCreateModal(false);
        fetchPublicRooms();
      }
    } catch (err) {
      setError("Gagal membuat room");
    } finally {
      setLoading(false);
    }
  };

  // Handle join dengan kode
  const handleJoinRoomWithCode = async () => {
    if (!roomCode.trim()) {
      setError("Kode room tidak boleh kosong");
      return;
    }
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch("http://localhost:5000/api/rooms/join-code", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomCode: roomCode.toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        if (socketRef.current) {
          socketRef.current.emit("join_room", { roomId: data.roomId });
        }
        setRoomCode("");
        setShowJoinCodeModal(false);
      }
    } catch (err) {
      setError("Gagal bergabung dengan kode room");
    } finally {
      setLoading(false);
    }
  };

  // Handle send chat
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentRoom || !socketRef.current) return;
    socketRef.current.emit("send_message", {
      roomId: currentRoom.roomId,
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  // Handle keluar dari room
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
      setShowChatModal(false);
      setMessages([]);
      setRoomMembers([]);
      setOnlineUsers(new Set());
    } catch (err) {
      setError("Gagal keluar dari room");
    }
  };

  const currentUser = getCurrentUser();

  return (
    <div className="p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Judul */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Belajar bersama, masuk ke{" "}
          <span className="text-blue-500">Ruang Belajar</span>
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Kamu bisa belajar bersama teman dengan masuk ke room yang sama.
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          + Buat Room
        </button>
        <button
          onClick={() => setShowJoinCodeModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all"
        >
          Gabung dengan Kode
        </button>
      </div>

      {/* Daftar Room Publik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <p>Loading room...</p>
        ) : publicRooms.length > 0 ? (
          publicRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="relative mb-4">
                <img
                  src={
                    room.creator_avatar ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  }
                  alt={room.name}
                  className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-blue-100"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <h3 className="font-semibold text-center">{room.name}</h3>
              <p className="text-sm text-gray-600 text-center truncate">
                {room.description || "Tidak ada deskripsi"}
              </p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Pembuat: {room.creator_name}</span>
                <span>{room.joined} orang</span>
              </div>
            </div>
          ))
        ) : (
          <p>Tidak ada room tersedia.</p>
        )}
      </div>

      {/* Modal: Pilih Room */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Bergabung dengan{" "}
              <span className="text-blue-500">{selectedRoom.name}</span>?
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Deskripsi
                </h3>
                <p className="text-gray-800">{selectedRoom.description}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Jumlah Orang</h3>
                  <p className="text-blue-500 font-medium">{selectedRoom.joined}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-600">Dibuat</h3>
                  <p className="text-blue-500 font-mono">
                    {new Date(selectedRoom.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleJoinRoom}
                className="flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] py-3 rounded-lg hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium text-white" 
              >
                Join
              </button>
              <button
                onClick={() => setSelectedRoom(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Buat Room */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Buat Room Baru
            </h2>
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Nama Room"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
            />
            <textarea
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              placeholder="Deskripsi (opsional)"
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
            ></textarea>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivateRoom(!isPrivate)}
              />
              <span>Room Private</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleCreateNewRoom}
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Loading..." : "Buat"}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Join dengan Kode */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowJoinCodeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Masukkan Kode Room
            </h2>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Contoh: ABC123"
              className="w-full p-3 border rounded-lg text-center text-lg font-mono tracking-widest uppercase focus:ring-2 focus:ring-blue-500 outline-none"
              maxLength={6}
            />
            <div className="mt-4 bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
              💡 Minta kode room dari teman kamu untuk bergabung.
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleJoinRoomWithCode}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                {loading ? "Loading..." : "Gabung"}
              </button>
              <button
                onClick={() => setShowJoinCodeModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Chat Room */}
      {showChatModal && currentRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl h-[90vh] rounded-2xl overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{currentRoom.roomName}</h2>
              <button
                onClick={handleLeaveRoom}
                className="text-red-500 hover:text-red-700"
              >
                <LogOut size={20} />
              </button>
            </div>
            {/* Pesan */}
            <div className="flex flex-col flex-grow p-4 overflow-y-auto h-[70vh]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    msg.type === "system"
                      ? "text-center text-gray-500"
                      : ""
                  }`}
                >
                  {msg.type !== "system" && (
                    <>
                      <strong>{msg.userName}</strong>:{" "}
                    </>
                  )}
                  {msg.message}
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            {/* Input */}
            <div className="border-t p-4 flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ketik pesan..."
                className="flex-grow p-2 border rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}