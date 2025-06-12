"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Konfigurasi warna untuk setiap gaya belajar
const learningStyleColors = {
  visual: {
    bg: "bg-gradient-to-r from-yellow-200 to-yellow-400", // Gold ringan
    text: "text-white font-semibold",
    hover: "hover:bg-gradient-to-r hover:from-yellow-300 hover:to-yellow-500"
  },
  auditori: {
    bg: "bg-gradient-to-r from-yellow-400 to-yellow-600", // Gold agak pekat
    text: "text-white font-semibold",
    hover: "hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-700"
  },
  kinestetik: {
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-700", // Gold banget
    text: "text-white font-semibold",
    hover: "hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-800"
  },
  default: {
    bg: "bg-gradient-to-r from-yellow-400 to-yellow-600", // Gold agak pekat
    text: "text-white font-semibold",
    hover: "hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-700"
  }
};


  // Function untuk mendapatkan warna berdasarkan learning style
  const getLearningStyleColor = (learningStyle) => {
    if (!learningStyle) return learningStyleColors.default;
    
    const style = learningStyle.toLowerCase();
    if (style.includes('visual')) return learningStyleColors.visual;
    if (style.includes('audio')) return learningStyleColors.auditori;
    if (style.includes('kinestetik')) return learningStyleColors.kinestetik;
    
    return learningStyleColors.default;
  };

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile API function
  const profileAPI = {
    getProfile: async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

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
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userData = await profileAPI.getProfile();
        setProfileData(userData);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // Fallback to localStorage data if API fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setProfileData(JSON.parse(storedUser));
          } catch (parseError) {
            console.error("Failed to parse stored user data:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Menu items dengan path routing
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Timer", path: "/pomodoro" },
    { name: "Teman", path: "/friend" },
    { name: "Ruang Belajar", path: "/room" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function untuk check apakah menu item sedang active
  const isActive = (path) => {
    return pathname === path;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Close mobile menu when clicking menu item
  const handleMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <div className="mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-4">
        <nav id="main-navbar" className="bg-white rounded-full px-4 py-1.5">
          <div className="flex items-center justify-between">
            {/* Kiri - Logo */}
            <div className="flex items-center">
              <Image
                src="/assets/mainLogo.png"
                alt="Main Logo"
                width={120}
                height={60}
                className="h-8 w-auto"
              />
            </div>

            {/* Tengah - Menu (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 justify-center space-x-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out transform ${
                    isActive(item.path)
                      ? "bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] text-white scale-105 shadow-lg hover:shadow-xl hover:scale-110"
                      : "bg-gray-100 text-[#424D66] hover:bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] hover:text-white hover:scale-105 hover:shadow-md"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.path) && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-full animate-pulse opacity-20"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden mr-2">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Kanan - Profile (Fixed width) - Hidden on mobile */}
            <div className="relative hidden md:block">
              <div
                className="flex items-center cursor-pointer hover:bg-blue-50 hover:shadow-md rounded-full px-3 py-1.5 transition-all duration-200 ease-out w-44"
                onClick={toggleDropdown}
              >
                {loading ? (
                  // Loading state
                  <div className="flex items-center w-full">
                    <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-3 animate-pulse">
                      <span className="text-gray-400 text-xs">••</span>
                    </div>
                    <div className="flex-1 mr-2">
                      <div className="w-20 h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <ChevronDown size={14} className="ml-auto" />
                  </div>
                ) : profileData ? (
                  // Profile data loaded
                  <div className="flex items-center w-full">
                    <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-3 overflow-hidden">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-xs font-medium">
                          {getInitials(profileData.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 mr-2 overflow-hidden">
                      <p className="text-xs font-medium text-[#424D66] leading-tight truncate">
                        {profileData.name || "User"}
                      </p>
                      {profileData.learning_style && (
                        <p className={`text-xs px-1.5 py-0.5 rounded-sm leading-none truncate transition-colors ${
                          getLearningStyleColor(profileData.learning_style).bg
                        } ${
                          getLearningStyleColor(profileData.learning_style).text
                        }`}>
                          {profileData.learning_style}
                        </p>
                      )}
                    </div>
                    <ChevronDown 
                      size={14} 
                      className={`ml-auto transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                ) : (
                  // Fallback state
                  <div className="flex items-center w-full">
                    <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center mr-3">
                      <span className="text-gray-600 text-xs">??</span>
                    </div>
                    <div className="flex-1 mr-2">
                      <p className="text-xs font-medium text-[#424D66] truncate">User</p>
                      <p className="text-xs bg-gray-300 px-1.5 py-0.5 rounded-sm truncate">-</p>
                    </div>
                    <ChevronDown size={14} className="ml-auto" />
                  </div>
                )}
              </div>

              {/* Desktop Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                  <a
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 rounded-md mx-1"
                  >
                    <User size={14} className="mr-2" />
                    Profile
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 rounded-md mx-1"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-out">
          <div className="p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#424D66]">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Profile Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-gray-200 w-12 h-12 flex items-center justify-center mr-3 overflow-hidden">
                  {profileData?.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm font-medium">
                      {getInitials(profileData?.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#424D66] mb-1">
                    {profileData?.name || "User"}
                  </p>
                  {profileData?.learning_style && (
                    <p className={`text-xs px-2 py-1 rounded-sm inline-block transition-colors ${
                      getLearningStyleColor(profileData.learning_style).bg
                    } ${
                      getLearningStyleColor(profileData.learning_style).text
                    }`}>
                      {profileData.learning_style}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Mobile Profile Actions */}
              <div className="space-y-2">
                <a
                  href="/profile"
                  onClick={handleMenuClick}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-700 transition-colors duration-150 rounded-md"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    handleLogout(e);
                    handleMenuClick();
                  }}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-white hover:text-blue-700 transition-colors duration-150 rounded-md"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </a>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={handleMenuClick}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-[#7FD8E8] to-[#0798C5] text-white shadow-md"
                      : "text-[#424D66] hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;