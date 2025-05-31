import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`flex sticky top-0 z-50 justify-between items-center py-3 px-16 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-16">
        {/* Logo */}
        <Link href='/' className='cursor-pointer'>
          <Image src="/assets/mainLogo.png" alt="Main Logo" width={150} height={50} />
        </Link>
        
        {/* Navigation Links */}
        <div className="flex gap-10">
          <a href="#about" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">About</a>
          <a href="#services" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Services</a>
          <a href="#contact" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Contact</a>
          <Link href="/navbar-main" className="rounded-full py-2 px-3 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Navbar-main</Link>
        </div>
      </div>

      <Link
        href="/login"
        className={`px-6 py-2 rounded-xl hover:rounded-full transition-[border-radius] duration-500 ease-in-out cursor-pointer 
          ${
            isScrolled
              ? 'bg-[#0798C5] text-white'
              : 'bg-white text-[#0798C5]'
          }`}
      >
        Login
      </Link>

    </nav>
  );
}

export default Navbar;
