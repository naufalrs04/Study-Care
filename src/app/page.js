"use client";

import React from 'react';
import Navbar from '@/components/navbar-landing';
import Image from 'next/image';

function App() {
  return (
    <div className="App bg-white">
      <Navbar/>
      <div className="absolute top-0 z-10 right-0 w-[700px] h-[700px] overflow-hidden z-0">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] rounded-full -top-1/4 -right-1/4"></div>
      </div>

      <div className="relative overflow-hidden min-h-screen bg-white flex items-center px-16">
        <aside className="w-1/2">
          <h2 className="text-[#0798C5] font-medium text-xl mb-2">Educational</h2>
          <h1 className="text-5xl font-bold mb-2 text-black">StudyCare</h1>
          <h1 className="text-5xl font-bold mb-4 text-black">Solutions</h1>
          <p className="text-gray-500 mb-8 font-bold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
            aliquip ex ea commo
          </p>
        <button className="px-8 py-2 rounded-full bg-[#0798C5] text-white font-bold transition duration-200 hover:bg-white hover:text-[#0798C5] border-2 border-transparent hover:border-[#0798C5] rounded-full cursor-pointer">
          Mulai Sekarang
        </button>
        </aside>
        
        <div className="w-1/2 z-50 flex justify-center items-center">
          <Image src="/assets/Human.png" alt="Main Logo" width={500} height={350}/>
        </div>
      </div>
    </div>
  );
}

export default App;

