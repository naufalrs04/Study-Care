"use client";

import '@/app/globals.css';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

const RoomPage = () => {
  return (
    <div id="room-page" className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-[#424D66] mb-4">Ruang Belajar</h1>
        <p className="text-gray-600">Ruang belajar virtual untuk sesi belajar bersama dan materi pembelajaran.</p>
        {/* Tambahkan konten room di sini */}
      </div>
    </div>
  );
};

export default RoomPage;
