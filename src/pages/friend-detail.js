import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, MessageCircle, UserPlus, Share2, MoreVertical, Flag, UserX, Copy, Check } from 'lucide-react';

export default function FriendProfilePage() {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleAddFriend = () => {
    setIsFriend(!isFriend);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    // Redirect to chat or open message modal
    alert("Membuka chat dengan Aditya...");
  };

  const handleShareProfile = async () => {
    const profileUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReport = () => {
    alert("Melaporkan profil...");
    setShowMoreOptions(false);
  };

  const handleBlock = () => {
    const confirm = window.confirm("Apakah Anda yakin ingin memblokir pengguna ini?");
    if (confirm) {
      alert("Pengguna telah diblokir");
      setShowMoreOptions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center justify-center w-10 h-10 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full transition-colors duration-200"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Profil</h1>
            <div className="relative">
              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <MoreVertical size={18} />
              </button>
              
              {/* More Options Dropdown */}
              {showMoreOptions && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                  <button
                    onClick={handleReport}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                  >
                    <Flag size={16} />
                    <span className="text-sm">Laporkan</span>
                  </button>
                  <button
                    onClick={handleBlock}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                  >
                    <UserX size={16} />
                    <span className="text-sm">Blokir</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-12 text-center relative">
            <div className="absolute inset-0 bg-cyan bg-opacity-10"></div>
            
            {/* Profile Photo */}
            <div className="relative z-10 mb-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-400"></div>
                </div>
              </div>
            </div>

            {/* Name and Learning Style */}
            <h2 className="text-3xl font-bold text-white mb-3">Aditya Haidar Faishal</h2>
            <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium shadow-lg">
              Visual
            </span>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-6 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">127</div>
                <div className="text-sm opacity-90">Teman</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm opacity-90">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">892</div>
                <div className="text-sm opacity-90">Jam</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-4 justify-center">
              
              <button
                onClick={handleAddFriend}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                  isFriend 
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                    : 'bg-white hover:bg-cyan-50 text-cyan-700 border-2 border-cyan-300'
                }`}
              >
                <UserPlus size={18} />
                <span>{isFriend ? 'Berteman' : 'Tambah Teman'}</span>
              </button>
              
              <button
                onClick={handleShareProfile}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          {/* Bio Section */}
          <div className="px-8 py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang</h3>
            <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>

          {/* Additional Info */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Gaya Belajar Favorit</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Visual</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Praktikal</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Topik Favorit</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Matematika</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Sains</span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">Teknologi</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Bergabung sejak Januari 2024
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showMoreOptions && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowMoreOptions(false)}
        ></div>
      )}
    </div>
  );
}