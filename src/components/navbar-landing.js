import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  return (
    <nav className="flex sticky top-0 z-20 justify-between items-center pt-5 px-16 bg-transparent">
      
    <div className="flex items-center gap-16">
        {/* Logo */}
        <Image src="/assets/mainLogo.png" alt="Main Logo" width={150} height={50} />
        
        {/* Navigation Links */}
        <div className="flex gap-10">
          <Link href="#about" className="rounded-full px-3 py-2 text-gray-600 hover:text-[#FFFFFF] hover:bg-[#0798C5] transition-colors">About</Link>
          <Link href="#services" className="rounded-full px-3 py-2 text-gray-600 hover:text-[#FFFFFF] hover:bg-[#0798C5] transition-colors">Services</Link>
          <Link href="#contact" className="rounded-full px-3 py-2 text-gray-600 hover:text-[#FFFFFF] hover:bg-[#0798C5] transition-colors">Contact</Link>
          <Link href="/navbar-main" className="rounded-full py-2 px-3 text-gray-600 hover:text-[#FFFFFF] hover:bg-[#0798C5] transition-colors">Adit</Link>
        </div>
      </div>
      
        <Link href="/login-page">
        <button className="bg-[#FFFFFF] text-[#0798C5] px-6 py-2 rounded-xl hover:rounded-full transition-[border-radius] duration-500 ease-in-out cursor-pointer">
            Login
        </button>
        </Link>

    </nav>
  );
}

export default Navbar;