"use client";

import "@/app/globals.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  X,
  Settings,
  LogOut,
  Save,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============= API SERVICES =============
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const profileAPI = {
  // Get current user profile
  getProfile: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get profile");
      }

      const data = await response.json();
      // Backend returns { success: true, user: profileData }
      if (data.success) {
        return data.user;
      } else {
        throw new Error(data.message || "Failed to get profile");
      }
    } catch (error) {
      console.error("Error getting profile:", error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/password`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to update password");
      }

      return data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  // Upload profile photo
  uploadPhoto: async (file) => {
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload photo");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to upload photo");
      }

      return data;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  },

  // Delete profile photo
  deletePhoto: async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/avatar`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete photo");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to delete photo");
      }

      return data;
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  },
};

export default function ProfilePage() {
  const router = useRouter();

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingTopics, setIsEditingTopics] = useState(false);

  // Profile Data - matching backend response structure
  const [profileData, setProfileData] = useState({
    id: null,
    name: "",
    email: "",
    bio: "",
    avatar: null,
    learning_style: "",
    interests: [],
    study_stats: {
      current_streak: 0,
      highest_streak: 0,
      total_study_hours: 0,
      last_study: null,
    },
    social_stats: {
      total_friends: 0,
    },
    joined_at: null,
    last_active: null,
  });

  // Temp states for editing
  const [tempBio, setTempBio] = useState("");
  const [tempTopics, setTempTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState({
    profile: true,
    updateProfile: false,
    updatePassword: false,
    uploadPhoto: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const profile = await profileAPI.getProfile();
      setProfileData(profile);
      setTempBio(profile.bio || "");
      setTempTopics(profile.interests || []);
      setError("");
    } catch (err) {
      setError(err.message || "Gagal memuat data profil");
      console.error("Load profile error:", err);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  // Photo upload handler
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    setLoading((prev) => ({ ...prev, uploadPhoto: true }));
    try {
      const result = await profileAPI.uploadPhoto(file);
      setProfileData((prev) => ({ ...prev, avatar: result.avatar_url }));
      setSuccess("Foto profil berhasil diupdate");
      setShowPhotoOptions(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Gagal mengupload foto");
    } finally {
      setLoading((prev) => ({ ...prev, uploadPhoto: false }));
    }
  };
  // const handlePhotoUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   console.log("Selected file:", file);

  //   // Validate file size (max 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     setError("Ukuran file maksimal 5MB");
  //     return;
  //   }

  //   // Validate file type
  //   if (!file.type.startsWith("image/")) {
  //     setError("File harus berupa gambar");
  //     return;
  //   }

  //   setLoading((prev) => ({ ...prev, uploadPhoto: true }));
  //   try {
  //     console.log("Starting upload...");
  //     const result = await profileAPI.uploadPhoto(file);
  //     console.log("Upload result:", result);

  //     setProfileData((prev) => ({ ...prev, avatar: result.avatar_url }));
  //     setSuccess("Foto profil berhasil diupdate");
  //     setShowPhotoOptions(false);
  //     setError("");
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     setError(err.message || "Gagal mengupload foto");
  //   } finally {
  //     setLoading((prev) => ({ ...prev, uploadPhoto: false }));
  //   }
  // };
  // Photo delete handler
  const handlePhotoDelete = async () => {
    setLoading((prev) => ({ ...prev, uploadPhoto: true }));
    try {
      await profileAPI.deletePhoto();
      setProfileData((prev) => ({ ...prev, avatar: null }));
      setSuccess("Foto profil berhasil dihapus");
      setShowPhotoOptions(false);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Gagal menghapus foto");
    } finally {
      setLoading((prev) => ({ ...prev, uploadPhoto: false }));
    }
  };

  // Bio save handler
  const handleBioSave = async () => {
    setLoading((prev) => ({ ...prev, updateProfile: true }));
    try {
      await profileAPI.updateProfile({ bio: tempBio });
      setProfileData((prev) => ({ ...prev, bio: tempBio }));
      setIsEditingBio(false);
      setSuccess("Bio berhasil diupdate");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Gagal mengupdate bio");
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }));
    }
  };

  const handleBioCancel = () => {
    setTempBio(profileData.bio || "");
    setIsEditingBio(false);
  };

  // Topics handlers
  const handleAddTopic = () => {
    if (newTopic.trim() && !tempTopics.includes(newTopic.trim())) {
      setTempTopics([...tempTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (index) => {
    setTempTopics(tempTopics.filter((_, i) => i !== index));
  };

  const handleTopicsSave = async () => {
    setLoading((prev) => ({ ...prev, updateProfile: true }));
    try {
      await profileAPI.updateProfile({ interests: tempTopics });
      setProfileData((prev) => ({ ...prev, interests: tempTopics }));
      setIsEditingTopics(false);
      setSuccess("Topik favorit berhasil diupdate");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Gagal mengupdate topik favorit");
    } finally {
      setLoading((prev) => ({ ...prev, updateProfile: false }));
    }
  };

  const handleTopicsCancel = () => {
    setTempTopics(profileData.interests || []);
    setNewTopic("");
    setIsEditingTopics(false);
  };

  // Password handlers
  const handlePasswordSave = async () => {
    // Clear previous errors
    setError("");

    if (!currentPassword) {
      setError("Password saat ini diperlukan");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    setLoading((prev) => ({ ...prev, updatePassword: true }));
    try {
      await profileAPI.updatePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditingPassword(false);
      setSuccess("Password berhasil diubah");
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Gagal mengubah password");
    } finally {
      setLoading((prev) => ({ ...prev, updatePassword: false }));
    }
  };

  const handlePasswordCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsEditingPassword(false);
    setError(""); // Clear any errors when canceling
  };

  const handleLogout = () => {
    const confirm = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirm) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "??";
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak diketahui";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return "Tidak diketahui";
    }
  };

  // Loading state
  if (loading.profile) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Success/Error Messages */}
        {(error || success) && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {error || success}
            <button
              onClick={() => {
                setError("");
                setSuccess("");
              }}
              className="ml-2 text-current hover:opacity-75"
            >
              ×
            </button>
          </div>
        )}

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-12 text-center relative">
              <div className="absolute inset-0 bg-cyan bg-opacity-10"></div>

              {/* Back Button */}
              <button
                onClick={handleBackClick}
                className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group"
              >
                <ArrowLeft
                  size={20}
                  className="text-white transition-transform duration-200 group-hover:-translate-x-1"
                />
              </button>

              {/* More Options */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
                >
                  <Settings size={20} className="text-white" />
                </button>

                {showMoreOptions && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg py-2 min-w-[150px] z-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Photo */}
              <div className="relative z-10 mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                      <span className="text-2xl font-bold text-cyan-700">
                        {getInitials(profileData.name)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPhotoOptions(true)}
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                  disabled={loading.uploadPhoto}
                >
                  {loading.uploadPhoto ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Edit size={14} />
                  )}
                </button>
              </div>

              {/* Name and Learning Style */}
              <h2 className="text-3xl font-bold text-white mb-3">
                {profileData.name}
              </h2>
              {profileData.learning_style && (
                <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium shadow-lg">
                  {profileData.learning_style}
                </span>
              )}

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-6 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {profileData.social_stats?.total_friends || 0}
                  </div>
                  <div className="text-sm opacity-90">Teman</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {profileData.study_stats?.current_streak || 0}
                  </div>
                  <div className="text-sm opacity-90">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {profileData.study_stats?.total_study_hours || 0}
                  </div>
                  <div className="text-sm opacity-90">Jam</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
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
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Informasi Akun
              </h3>

              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-gray-600">{profileData.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Email tidak dapat diubah
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12">
                        <div className="text-gray-600">
                          {showPassword ? "••••••••••••" : "••••••••••••"}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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
                    className="w-full p-4 border border-gray-300 rounded-2xl resize-none h-32 focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-black focus:outline-none"
                    placeholder="Tulis bio Anda..."
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 text-right">
                    {tempBio.length}/500 karakter
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={handleBioCancel}
                      disabled={loading.updateProfile}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                    >
                      <X size={16} />
                      <span>Batal</span>
                    </button>
                    <button
                      onClick={handleBioSave}
                      disabled={loading.updateProfile}
                      className="flex items-center gap-2 px-6 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading.updateProfile ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed">
                  {profileData.bio ||
                    "Belum ada bio. Klik edit untuk menambahkan bio Anda."}
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Gaya Belajar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.learning_style ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        {profileData.learning_style}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        Belum ditentukan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Bergabung sejak {formatDate(profileData.joined_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Similar to mobile but horizontal */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex">
              {/* Left side with profile info */}
              <div className="w-1/3 bg-gradient-to-b from-cyan-400 to-blue-500 p-8 text-center relative">
                {/* Back Button */}
                <button
                  onClick={handleBackClick}
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 group"
                >
                  <ArrowLeft
                    size={20}
                    className="text-white transition-transform duration-200 group-hover:-translate-x-1"
                  />
                </button>

                {/* More Options */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
                  >
                    <Settings size={20} className="text-white" />
                  </button>

                  {showMoreOptions && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg py-2 min-w-[150px] z-10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Profile Photo */}
                <div className="relative z-10 mb-6 mt-8">
                  <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 flex items-center justify-center">
                        <span className="text-2xl font-bold text-cyan-700">
                          {getInitials(profileData.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowPhotoOptions(true)}
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                    disabled={loading.uploadPhoto}
                  >
                    {loading.uploadPhoto ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Edit size={14} />
                    )}
                  </button>
                </div>

                {/* Name and Learning Style */}
                <h2 className="text-3xl font-bold text-white mb-3">
                  {profileData.name}
                </h2>
                {profileData.learning_style && (
                  <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium shadow-lg mb-4">
                    {profileData.learning_style}
                  </span>
                )}

                {/* Stats */}
                <div className="flex justify-center gap-6 mt-6 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profileData.social_stats?.total_friends || 0}
                    </div>
                    <div className="text-sm opacity-90">Teman</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profileData.study_stats?.current_streak || 0}
                    </div>
                    <div className="text-sm opacity-90">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {profileData.study_stats?.total_study_hours || 0}
                    </div>
                    <div className="text-sm opacity-90">Jam</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <Link
                    href="/welcome-test"
                    className="block w-full max-w-xs mx-auto bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full backdrop-blur-sm transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-center"
                  >
                    Tes Lagi!
                  </Link>
                </div>

                <div className="mt-auto pt-8 text-center text-white/70 text-sm">
                  Bergabung sejak {formatDate(profileData.joined_at)}
                </div>
              </div>

              {/* Right side with account info and bio */}
              <div className="w-2/3 flex flex-col">
                {/* Account Info Section */}
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8">
                    Informasi Akun
                  </h3>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email
                      </label>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-gray-600 text-lg">
                          {profileData.email}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Email tidak dapat diubah
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Password
                      </label>
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12">
                            <div className="text-gray-600 text-lg">
                              {showPassword ? "••••••••••••" : "••••••••••••"}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors duration-200"
                        >
                          Ubah
                        </button>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-800">
                          Tentang
                        </h4>
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
                            className="w-full p-4 border border-gray-300 rounded-2xl resize-none h-32 focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-black focus:outline-none"
                            placeholder="Tulis bio Anda..."
                            maxLength={500}
                          />
                          <div className="text-xs text-gray-500 text-right">
                            {tempBio.length}/500 karakter
                          </div>
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={handleBioCancel}
                              disabled={loading.updateProfile}
                              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                            >
                              <X size={16} />
                              <span>Batal</span>
                            </button>
                            <button
                              onClick={handleBioSave}
                              disabled={loading.updateProfile}
                              className="flex items-center gap-2 px-8 py-3 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                            >
                              {loading.updateProfile ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Save size={16} />
                              )}
                              <span>Simpan</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed text-lg">
                          {profileData.bio ||
                            "Belum ada bio. Klik edit untuk menambahkan bio Anda."}
                        </div>
                      )}
                    </div>

                    {/* Learning Style and Topics */}
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Gaya Belajar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.learning_style ? (
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              {profileData.learning_style}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Belum ditentukan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Options Popup */}
      {showPhotoOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Foto Profil
              </h3>
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
                  disabled={loading.uploadPhoto}
                />
              </label>
              {profileData.avatar && (
                <button
                  onClick={handlePhotoDelete}
                  disabled={loading.uploadPhoto}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg w-full text-left transition-colors duration-200 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Ubah Password
              </h3>
              <button
                onClick={handlePasswordCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:outline-none text-black"
                  placeholder="Masukkan password saat ini"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:outline-none text-black"
                  placeholder="Masukkan password baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:outline-none text-black"
                  placeholder="Konfirmasi password baru"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handlePasswordCancel}
                  disabled={loading.updatePassword}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handlePasswordSave}
                  disabled={loading.updatePassword}
                  className="flex-1 px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {loading.updatePassword ? "Loading..." : "Simpan"}
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
