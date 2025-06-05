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
        {/* Tambahkan konten friend di sini */}
      </div>
    </div>
  );
};

export default FriendPage;

