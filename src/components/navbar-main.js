"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Gagal parsing user data", error);
      }
    }
  }, []);
  const learningStyleLabels = {
    1: "Auditori",
    2: "Visual",
    3: "Kinestetik",
  };
  const getStyleClass = (style) => {
    switch (style) {
      case 1:
        return "bg-gradient-to-r from-blue-200 to-blue-300 text-blue-800";
      case 2:
        return "bg-gradient-to-r from-green-200 to-green-300 text-green-800";
      case 3:
        return "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600";
    }
  };
  const getLearningStyleLabel = (style) => {
    return learningStyleLabels[style] || "-";
  };
  // Menu items dengan path routing
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Timer", path: "/pomodoro" },
    { name: "Teman", path: "/friend" },
    { name: "Ruang Belajar", path: "/room" },
  ];
  const getInitials = (name) => {
    if (!name) return "P";
    const words = name.split(" ");
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  return (
    <nav id="main-navbar" className="bg-white rounded-full mt-3 px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Kiri - Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/mainLogo.png"
            alt="Main Logo"
            width={150}
            height={75}
          />
        </div>

        {/* Tengah - Menu */}
        <div className="flex-1 flex justify-center space-x-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`px-3 py-1 rounded-full transition-colors ${
                isActive(item.path)
                  ? "bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] text-white"
                  : "bg-gray-100 text-[#424D66] hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Kanan - Profile */}
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center mr-2">
              <span className="text-gray-600">{getInitials(user?.name)}</span>
            </div>
            <div className="mr-2">
              <p className="text-sm font-medium text-[#424D66]">
                {user?.name || "Pengguna"}
              </p>

              {user && (
                <span
                  className={`inline-block px-3 text-sm font-medium rounded-full ${getStyleClass(
                    user?.learning_style
                  )}`}
                >
                  {getLearningStyleLabel(user?.learning_style)}
                </span>
              )}
            </div>
            <ChevronDown size={16} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <User size={16} className="mr-2" />
                Profile
              </a>
              <a
                href="#"
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
