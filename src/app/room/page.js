"use client";

import '@/app/globals.css';
import React, { useState } from 'react';
import { X, Users, Clock } from 'lucide-react';

const RoomPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPrivate, setIsPrivateRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const publicRooms = [
    {
      id: 1,
      name: "Aditya's Room",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      joined: "5",
      timeLast: "02 : 10 : 45",
      description: "Sini bray join kita chill sampe pagi, gas kuy"
    },
    {
      id: 2,
      name: "Bambang's Room",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      joined: "3",
      timeLast: "01 : 30 : 22",
      description: "Belajar bareng matematika dan fisika, yuk join!"
    },
    {
      id: 3,
      name: "Rudi's Room",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      joined: "7",
      timeLast: "03 : 45 : 15",
      description: "Study session untuk persiapan ujian akhir semester"
    }
  ];

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleJoinRoom = () => {
    alert(`Bergabung dengan ${selectedRoom.name}!`);
    setSelectedRoom(null);
  };

  const handleCancelJoin = () => {
    setSelectedRoom(null);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setRoomName('');
    setRoomDescription('');
    setIsPrivateRoom(false);
  };

  const handleCreateNewRoom = () => {
    if (roomName.trim()) {
      const newRoom = {
        name: roomName,
        description: roomDescription,
        isPrivate: isPrivate,
        createdAt: new Date(),
      };

      console.log('Room berhasil dibuat:', newRoom);
      setShowCreateModal(false);
      setRoomName('');
      setRoomDescription('');
      setIsPrivateRoom(false);
    } 
    else {
      alert('Nama room tidak boleh kosong!');
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setRoomName('');
    setRoomDescription('');
    setIsPrivateRoom(false);
  };

  const handleJoinWithCode = () => {
    setShowJoinCodeModal(true);
  };

  const handleCloseJoinCodeModal = () => {
    setShowJoinCodeModal(false);
    setRoomCode('');
  };

  const handleJoinRoomWithCode = () => {
    if (roomCode.trim()) {
      if (roomCode.length >= 6) {
        console.log(`Bergabung dengan room menggunakan kode: ${roomCode}`);
        setShowJoinCodeModal(false);
        setRoomCode('');
      } else {
        alert('Kode room harus minimal 6 karakter!');
      }
    } 
    else {
      alert('Kode room tidak boleh kosong!');
    }
  };

  const handleCancelJoinCode = () => {
    setShowJoinCodeModal(false);
    setRoomCode('');
  };

  return (
    <div className='p-6'>
      <div className='flex'>
        <div className='flex flex-col flex-grow'>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Belajar bersama, masuk ke{' '}
            <span className="text-blue-500">Ruang Belajar</span>
          </h1>
          <p className="text-gray-600 max-w-5xl">
            Kamu bisa belajar bersama dengan masuk ke room yang sama dengan temanmu, buat room 
            dan undang temanmu atau bergabung ke room public yang tersedia. Kamu juga bisa 
            mengobrol dengan temanmu di room tersebut, ayo belajar bersama!
          </p>
        </div>
        <div className='flex my-auto mx-auto gap-x-4'>
          <button 
          onClick={handleJoinWithCode}
          className="cursor-pointer bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white px-4 py-2 rounded-full transform hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors flex items-center">
            Join Room with Code
          </button>
          <button 
          onClick = {handleCreateRoom}
          className="cursor-pointer bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white px-4 py-2 rounded-full transform hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors flex items-center gap-2">
            <span className="text-sm">+</span>
            Buat Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mt-5 p-6">
        {/* Public Room Section */}
        <div className="w-full">
          <div className="flex justify-center gap-3 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Public Room</h2>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6">
            {publicRooms.map((room) => (
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
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{room.name}</h3>
                  <p className="text-sm text-blue-500 mb-2">{room.joined} joined  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Join <span className="text-blue-500">{selectedRoom.name}</span>?
              </h2>

              {/* Content */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
                  <p className="text-gray-800">{selectedRoom.description}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Joined</h3>
                    <p className="text-blue-500 font-medium">{selectedRoom.joined}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Time Last</h3>
                    <p className="text-blue-500 font-medium font-mono">{selectedRoom.timeLast}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleJoinRoom}
                  className="cursor-pointer flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium"
                >
                  Join
                </button>
                <button
                  onClick={handleCancelJoin}
                  className="cursor-pointer flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={handleCloseCreateModal}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Buat Room
            </h2>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="Nama room"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Deskripsi Room"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivateRoom(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600">Private Room</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateNewRoom}
                className="cursor-pointer flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium"
              >
                Buat
              </button>
              <button
                onClick={handleCancelCreate}
                className="cursor-pointer flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
        )}

        {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={handleCloseJoinCodeModal}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Join Room with Code
            </h2>

            {/* Form */}
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
                  className="text-gray-600 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg font-mono tracking-wider"
                  maxLength={10}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tips:</strong> Minta kode room dari teman yang sudah membuat room.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleJoinRoomWithCode}
                className="cursor-pointer flex-1 bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] py-3 rounded-lg hover:bg-gradient-to-t hover:from-[#7FD8E8] hover:to-[#0B92C2] transition-colors font-medium"
              >
                Join Room
              </button>
              <button
                onClick={handleCancelJoinCode}
                className="cursor-pointer flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
        )}


      </div>
    </div>
  );
};

export default RoomPage;
