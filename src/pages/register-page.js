import '@/app/globals.css';
import React, { useState } from 'react';
import Image from 'next/image';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login with:', username, password);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left Side - Image Section */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-12">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center mb-2">
          <Image src="/assets/mainLogo.png" alt="Main Logo" width={150} height={75}/>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[#0798C5] mb-1">Hai, Selamat datang!</h1>
          <p className="text-gray-400 text-sm">
            Sudah punya akun? <a href="/login-page" className="text-cyan-500 hover:underline">Masuk Sekarang</a>
          </p>
        </div>

        {/* Login Inputs */}
        <div className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="rePassword"
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300"
          >
            Daftar
          </button>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mt-12 mb-4 border-t border-gray-200"></div>

        {/* Terms and Privacy Policy */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Dengan melanjutkan, kamu menerima{' '}
            <a href="#" className="text-cyan-500 hover:underline">Syarat Penggunaan</a>{' '}
            dan{' '}
            <a href="#" className="text-cyan-500 hover:underline">Kebijakan Privasi</a>{' '}
            kami.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}

      <div className="w-1/2 bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex items-center justify-center relative overflow-hidden rounded-tr-xl rounded-br-xl">
        {/* This div is where the image would be placed */}
        <div className="w-full h-full">
          {/* Placeholder for the AI robot and tech elements image */}
          <div className="absolute inset-0 flex items-center justify-center transform scale-x-[-1]">
            <Image src="/assets/loginImgg.png" alt="Main Logo" width={500} height={350} className='w-full'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;