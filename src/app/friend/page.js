"use client";

import React, { useState, useEffect } from 'react';
import { Info, UserMinus, UserPlus } from 'lucide-react';

const DaftarTeman = () => {
  const [activeTab, setActiveTab] = useState('daftar');

  const friends = [
    {
      id: 1,
      name: 'Fendi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      status: 'Belajar React',
      time: '02:04:46',
      isOnline: true,
      isVisual: true
    },
    {
      id: 2,
      name: 'Naufal',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      status: 'Offline',
      time: null,
      isOnline: false,
      isVisual: true
    },
    {
      id: 3,
      name: 'Hanip',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
      status: 'Belajar Alpro',
      time: '02:04:46',
      isOnline: true,
      isVisual: true
    }
  ];

  const requests = [
    {
      id: 1,
      name: 'Satria',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
      message: 'Halo cantik, ayo berteman',
    },
    {
      id: 2,
      name: 'Dewi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
      message: 'Halo gantenk, ayo berteman',
    }
  ]

  useEffect(() => {
    const setTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === '#connect') setActiveTab('daftar');
      else if (hash === '#add') setActiveTab('rekomendasi');
      else if (hash === '#req') setActiveTab('permintaan');
    };
    setTabFromHash();
    window.addEventListener('hashchange', setTabFromHash);
    return () => window.removeEventListener('hashchange', setTabFromHash);
  }, []);

  return (

    <div className='p-6'>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Tab Navigation */}
        <div className="flex border-b-0 bg-white/50 backdrop-blur-sm">
          <a
            href="#connect"
            onClick={() => setActiveTab('daftar')}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'daftar' ? 'bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105' 
            : 'text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90'}`}
          >
            Daftar Teman
          </a>
          <a
            href="#add"
            onClick={() => setActiveTab('rekomendasi')}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'rekomendasi' ? 'bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105' 
            : 'text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90'}`}
          >
            Rekomendasi
          </a>
          <a
            href="#req"
            onClick={() => setActiveTab('permintaan')}
            className={`text-center cursor-pointer flex-1 py-5 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'permintaan' ? 'bg-gradient-to-t from-[#0B92C2] to-[#7FD8E8] text-white rounded-t-2xl shadow-md transform scale-105' 
            : 'text-gray-600 hover:bg-gradient-to-t hover:from-gray-100 hover:to-gray-50 hover:text-gray-800 hover:scale-90'}`}
          >
            Permintaan
          </a>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'daftar' && (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 rounded-full object-cover shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300"
                      />
                      {friend.isOnline && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{friend.name}</h3>
                      {friend.isVisual && (
                        <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                          Visual
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-1 mt-1">
                    <p className={`text-sm ${friend.isOnline ? 'text-blue-400' : 'text-gray-500 italic'}`}>{friend.status}</p>
                    {friend.time && (
                      <span className="text-xs text-gray-400">{friend.time}</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="cursor-pointer p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md" title="Info">
                      <Info size={18} />
                    </button>
                    <button className="cursor-pointer p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md" title="Hapus Teman">
                      <UserMinus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rekomendasi' && (
            <div className="py-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Rekomendasi Teman</h3>
                <p className="text-gray-500">Teman dengan minat dan gaya belajar yang sama</p>
              </div>
              <div className="flex items-center space-x-3 max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Masukkan nama atau username"
                  className="flex-1 px-4 py-3 text-sm text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
                <button className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'permintaan' && (
            <div className="space-y-4">
              {requests.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-5 rounded-2xl bg-white shadow-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-14 h-14 rounded-full object-cover shadow-lg ring-3 ring-white group-hover:ring-blue-200 transition-all duration-300"
                      />
                      {friend.isOnline && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{friend.name}</h3>
                      {friend.isVisual && (
                        <span className="px-2 py-1 text-xs font-bold text-amber-700 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full shadow-sm">
                          Visual
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-1 mt-1">
                    <p className={`text-sm ${friend.isOnline ? 'text-blue-400' : 'text-gray-500 italic'}`}>pesan : {friend.message}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="cursor-pointer p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md" title="Info">
                      <Info size={18} />
                    </button>
                    <button className="cursor-pointer p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md" title="Tambah Teman">
                      <UserPlus size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default DaftarTeman;
