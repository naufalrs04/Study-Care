"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

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
              <span className="text-gray-600">AH</span>
            </div>
            <div className="mr-2">
              <p className="text-sm font-medium text-[#424D66]">
                Aditya Haidar
              </p>
              <p className="text-xs bg-yellow-300 px-2 rounded-sm">Visual</p>
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
