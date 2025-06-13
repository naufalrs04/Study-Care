"use client";

import "@/app/globals.css";
import Image from "next/image";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        const user = data.user;

        if (user.learning_style === null || user.learning_style === undefined) {
          window.location.href = "/welcome-test";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Left Side - Image Section */}
      <div className="w-1/2 bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex items-center justify-center relative overflow-hidden rounded-tr-xl rounded-br-xl">
        {/* This div is where the image would be placed */}
        <div className="w-full h-full">
          {/* Placeholder for the AI robot and tech elements image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/loginImgg.png"
              alt="Main Logo"
              width={500}
              height={350}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-12">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Image
              src="/assets/mainLogo.png"
              alt="Main Logo"
              width={150}
              height={75}
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-cyan-500 mb-1">
            Selamat datang kembali
          </h1>
          <p className="text-gray-400 text-sm">
            Baru di StudyFinder?{" "}
            <Link href="/register" className="text-cyan-500 hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </div>

        {/* Login Inputs */}
        <form onSubmit={handleLogin} className="w-full max-w-md mb-20">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-[#A4A4A4] rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300"
          >
            Masuk
          </button>
        </form>

        {/* Divider */}
        <div className="w-full max-w-md mb-4 border-1 border-gray-200"></div>

        {/* Terms and Privacy Policy */}
        <div className="text-center text-sm text-gray-500 pt-20">
          <p>
            Dengan melanjutkan, kamu menerima{" "}
            <a href="#" className="text-cyan-500 hover:underline">
              Syarat Penggunaan
            </a>{" "}
            dan{" "}
            <a href="#" className="text-cyan-500 hover:underline">
              Kebijakan Privasi
            </a>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
