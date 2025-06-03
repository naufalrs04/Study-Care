"use client";

import '@/app/globals.css';
import Image from 'next/image';
import React, { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import DashboardSection from '@/components/sections/dashboard';

// Main Layout Component
const Layout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  
  // Sample content for different pages
  const pageContent = {
    Dashboard: <DashboardSection/>,
    Timer: "Timer functionality and content",
    Teman: "Teman page content",
    "Ruang Belajar": "Ruang Belajar content and materials"
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changePage = (page) => {
    setActivePage(page);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Navbar */}
      <nav className="bg-white rounded-full shadow-md mt-3 px-6 py-2">
        <div className="flex items-center justify-between">
          
          {/* Kiri - Logo */}
          <div className="flex items-center">
            <Image src="/assets/mainLogo.png" alt="Main Logo" width={150} height={75} />
          </div>

          {/* Tengah - Menu */}
          <div className="flex-1 flex justify-center space-x-4">
            {['Dashboard', 'Timer', 'Teman', 'Ruang Belajar'].map((page) => (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-3 py-1 rounded-full  ${
                  activePage === page
                    ? 'bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] text-white'
                    : 'bg-gray-100 text-[#424D66]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Kanan - Profile */}
          <div className="relative">
            <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
              <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center mr-2">
                <span className="text-gray-600">AH</span>
              </div>
              <div className="mr-2">
                <p className="text-sm font-medium text-[#424D66]">Aditya Haidar</p>
                <p className="text-xs bg-yellow-300 px-2 rounded-sm">Visual</p>
              </div>
              <ChevronDown size={16} />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#user-profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User size={16} className="mr-2" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Content Section */}
      <div>
          {pageContent[activePage]}
      </div>
    </div>
  );
};

export default Layout;