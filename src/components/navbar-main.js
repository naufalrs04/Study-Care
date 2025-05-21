"use client";

import React, { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';

// Main Layout Component
const Layout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('Dashboard');
  
  // Sample content for different pages
  const pageContent = {
    Dashboard: "Dashboard content goes here",
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3 px-6">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Items */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center">
              <svg className="w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="ml-2 font-bold text-cyan-500">STUDY CARE</span>
            </div>
            
            {/* Menu Items */}
            <div className="flex space-x-4">
              <button 
                onClick={() => changePage('Dashboard')}
                className={`px-3 py-1 rounded-full ${activePage === 'Dashboard' ? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600' : 'bg-gray-100'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => changePage('Timer')}
                className={`px-3 py-1 rounded-full ${activePage === 'Timer' ? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600' : 'bg-gray-100'}`}
              >
                Timer
              </button>
              <button 
                onClick={() => changePage('Teman')}
                className={`px-3 py-1 rounded-full ${activePage === 'Teman' ? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600' : 'bg-gray-100'}`}
              >
                Teman
              </button>
              <button 
                onClick={() => changePage('Ruang Belajar')}
                className={`px-3 py-1 rounded-full ${activePage === 'Ruang Belajar' ? 'bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600' : 'bg-gray-100'}`}
              >
                Ruang Belajar
              </button>
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="relative">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={toggleDropdown}
            >
              <div className="rounded-full bg-gray-200 w-10 h-10 flex items-center justify-center mr-2">
                <span className="text-gray-600">AH</span>
              </div>
              <div className="mr-2">
                <p className="text-sm font-medium">Aditya Haidar</p>
                <p className="text-xs bg-yellow-300 px-2 rounded-sm">Visual</p>
              </div>
              <ChevronDown size={16} />
            </div>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
      
      {/* Title Section */}
      <div className="py-6 px-8 bg-white">
        <h1 className="text-2xl font-bold text-gray-700">Title page</h1>
      </div>
      
      {/* Content Section */}
      <div className="flex-1 px-8 py-12 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <h2 className="text-xl mb-4">content section</h2>
          <p>{pageContent[activePage]}</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;