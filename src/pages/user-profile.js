import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, Edit, Eye, EyeOff, Upload, Trash2, X } from 'lucide-react';

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-12 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Profil</h1>
          <div className="w-12"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Profile Info */}
            <div className="flex flex-col items-center lg:w-1/3">
              {/* Profile Photo */}
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 border-4 border-cyan-300 flex items-center justify-center overflow-hidden shadow-lg">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-cyan-300"></div>
                  )}
                </div>
                <button
                  onClick={() => setShowPhotoOptions(true)}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                >
                  <Edit size={16} />
                </button>
              </div>

              {/* Name and Learning Style */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aditya Haidar Faishal</h2>
              <span className="px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium mb-6">
                Visual
              </span>

              {/* Test Again Button */}
              <button className="w-full max-w-xs bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
                Tes Lagi!
              </button>
            </div>

            {/* Right Side - Form Fields */}
            <div className="lg:w-2/3 space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value="ahf.aditya@gmail.com"
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      disabled={!isEditingPassword}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl pr-12 text-gray-600"
                    />
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

              {/* Bio Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <div className="space-y-3">
                  {isEditingBio ? (
                    <textarea
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Tulis bio Anda..."
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingBio(true)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl min-h-32 cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                    >
                      {bio}
                    </div>
                  )}
                  
                  {isEditingBio && (
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={handleBioCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleBioSave}
                        className="px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200"
                      >
                        Simpan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Options Popup */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-transparent-100 bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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
    </div>
  );
}