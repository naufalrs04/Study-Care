import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center py-3 px-4 md:px-8 lg:px-16">
        <div className="flex items-center">
          {/* Logo */}
          <Link href='/' className='cursor-pointer'>
            <Image 
              src="/assets/mainLogo.png" 
              alt="Main Logo" 
              width={120} 
              height={40}
              className="md:w-[150px] md:h-[50px]"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-16">
          <div className="flex gap-10">
            <a href="#about" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">About</a>
            <a href="#services" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Services</a>
            <a href="#contact" className="rounded-full px-3 py-2 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Contact</a>
            <Link href="/dashboard" className="rounded-full py-2 px-3 text-gray-600 hover:text-white hover:bg-[#0798C5] transition-colors">Dashboard</Link>
          </div>
        </div>

        {/* Desktop Login Button */}
        <Link
          href="/login"
          className={`hidden lg:block px-6 py-2 rounded-xl hover:rounded-full transition-[border-radius] duration-500 ease-in-out cursor-pointer 
            ${
              isScrolled
                ? 'bg-[#0798C5] text-white'
                : 'bg-white text-[#0798C5]'
            }`}
        >
          Masuk
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden z-50 relative p-2 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span 
              className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ease-out ${
                isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ease-out ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span 
              className={`block h-0.5 w-6 bg-gray-600 transition-all duration-300 ease-out ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Image 
              src="/assets/mainLogo.png" 
              alt="Main Logo" 
              width={120} 
              height={40}
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col flex-1 py-8">
            <a 
              href="#about" 
              onClick={closeMobileMenu}
              className="block px-6 py-4 text-gray-700 hover:text-[#0798C5] hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              About
            </a>
            <a 
              href="#services" 
              onClick={closeMobileMenu}
              className="block px-6 py-4 text-gray-700 hover:text-[#0798C5] hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              Services
            </a>
            <a 
              href="#contact" 
              onClick={closeMobileMenu}
              className="block px-6 py-4 text-gray-700 hover:text-[#0798C5] hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              Contact
            </a>
            <Link 
              href="/dashboard" 
              onClick={closeMobileMenu}
              className="block px-6 py-4 text-gray-700 hover:text-[#0798C5] hover:bg-gray-50 transition-colors border-b border-gray-50"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Login Button */}
          <div className="p-6 border-t border-gray-100">
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="block w-full text-center px-6 py-3 bg-[#0798C5] text-white rounded-xl hover:bg-[#0690B8] transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;