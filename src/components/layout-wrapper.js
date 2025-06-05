"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar-main';
import MiniTimer from '@/components/MiniTimer';

const MainLayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  
  // Daftar pages yang membutuhkan navbar
  const pagesWithNavbar = ['/dashboard', '/pomodoro', '/friend', '/room'];
  const pagesWithTimer = ['/dashboard','/friend', '/room'];

  // Check apakah current page membutuhkan navbar atau timer
  const shouldShowNavbar = pagesWithNavbar.includes(pathname);
  const shouldShowTimer = pagesWithTimer.includes(pathname);

  if (shouldShowNavbar) {
    return (
      <div id="main-app" className="flex flex-col min-h-screen bg-[#F9F9F9]">
        <Navbar />
        {shouldShowTimer && <MiniTimer />} {/*render MiniTimer jika kondisi true*/}
        <div id="page-content" className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  // Untuk pages lain (seperti welcome, login, register, dll) tampilkan tanpa navbar
  return (
    <div id="main-app">
      {children}
    </div>
  );
};

export default MainLayoutWrapper;