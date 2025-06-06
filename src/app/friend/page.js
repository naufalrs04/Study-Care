"use client";

import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

const FriendPage = () => {
  return (
    <div id="friend-page" className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#424D66] mb-4">Teman</h1>
        <p className="text-gray-600">Halaman untuk melihat dan mengelola teman belajar Anda.</p>
        <Link
            href="/profile"
            className="mb-10 mt-10 block w-full max-w-xs bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-center"
        >
            PROFIL USER
        </Link>
        <Link
            href="/friend-detail"
            className="block w-full max-w-xs bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 text-center"
        >
            PROFILE TEMEN
        </Link>
        {/* Tambahkan konten friend di sini */}
      </div>
    </div>
  );
};

export default FriendPage;

