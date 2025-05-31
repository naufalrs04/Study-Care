"use client";

import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, Edit, Eye, EyeOff, Upload, Trash2, X, Settings, LogOut, Save, Cancel } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
  const [tempBio, setTempBio] = useState(bio);
  const [password, setPassword] = useState("MySecretPassword123");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBackClick = () => {
    window.history.back();
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    setShowPhotoOptions(false);
  };

  const handlePhotoDelete = () => {
    setProfilePhoto(null);
    setShowPhotoOptions(false);
  };

  const handleBioSave = () => {
    setBio(tempBio);
    setIsEditingBio(false);
  };

  const handleBioCancel = () => {
    setTempBio(bio);
    setIsEditingBio(false);
  };

  const handlePasswordSave = () => {
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      setPassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
      alert("Password berhasil diubah!");
    } else {
      alert("Password tidak cocok atau terlalu pendek!");
    }
  };

  const handlePasswordCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingPassword(false);
  };

  const handleLogout = () => {
    const confirm = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirm) {
      alert("Berhasil logout!");
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
                <Settings size={18} />
              </button>
              
              {/* More Options Dropdown */}
              {showMoreOptions && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Keluar</span>
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
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-400"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowPhotoOptions(true)}
                className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <Edit size={14} />
              </button>
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

              <Link
                href="/welcome-test"
                className="block w-full max-w-xs bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Tes Lagi!
              </Link>

              
            </div>
          </div>

          {/* Account Info Section */}
          <div className="px-8 py-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Informasi Akun</h3>
            
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-gray-600">ahf.aditya@gmail.com</div>
                  <div className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12">
                      <div className="text-gray-600">
                        {showPassword ? password : "••••••••••••"}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors duration-200"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="px-8 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Tentang</h3>
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-medium"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="space-y-4">
                <textarea
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl text-black resize-none h-32 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Tulis bio Anda..."
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleBioCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    <X size={16} />
                    <span>Batal</span>
                  </button>
                  <button
                    onClick={handleBioSave}
                    className="flex items-center gap-2 px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <Save size={16} />
                    <span>Simpan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
                {bio}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Gaya Belajar Saya</h4>
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

      {/* Photo Options Popup */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Foto Profil</h3>
              <button
                onClick={() => setShowPhotoOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                <Upload size={20} className="text-cyan-500" />
                <span className="text-gray-700">Upload Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {profilePhoto && (
                <button
                  onClick={handlePhotoDelete}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left transition-colors duration-200"
                >
                  <Trash2 size={20} className="text-red-500" />
                  <span className="text-gray-700">Hapus Foto</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Change Popup */}
      {isEditingPassword && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ubah Password</h3>
              <button
                onClick={handlePasswordCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Konfirmasi password baru"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordCancel}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handlePasswordSave}
                  className="flex-1 px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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