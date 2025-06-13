"use client";

import "@/app/globals.css";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError("");
    }
  };

  // Clear alert after 5 seconds
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 5000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate email before submitting
    if (!validateEmail(email)) {
      showAlert("Format email tidak valid", "error");
      return;
    }

    if (password !== rePassword) {
      showAlert("Password tidak cocok", "error");
      return;
    }

    setIsLoading(true);
    setAlert({ message: "", type: "" });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        showAlert(
          "Registrasi berhasil! Mengalihkan ke halaman login...",
          "success"
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        showAlert(data.message || "Registrasi gagal", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan saat registrasi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gray-100">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 order-2 lg:order-1">
        {/* Logo */}
        <div className="mb-6 lg:mb-8 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Image
              src="/assets/mainLogo.png"
              alt="Main Logo"
              width={120}
              height={60}
              className="sm:w-[150px] sm:h-[75px]"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl font-medium text-[#0798C5] mb-1">
            Hai, Selamat datang!
          </h1>
          <p className="text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-cyan-500 hover:underline">
              Masuk Sekarang
            </Link>
          </p>
        </div>

        {/* Alert Space - Fixed height to prevent layout shift */}
        <div className="w-full max-w-md mb-4 h-12 flex items-center justify-center">
          {alert.message && (
            <div
              className={`w-full px-4 py-2 rounded-md text-xs sm:text-sm text-center transition-all duration-300 ${
                alert.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {alert.message}
            </div>
          )}
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="w-full max-w-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="w-full px-4 py-3 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors text-sm sm:text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-1 transition-colors text-sm sm:text-base ${
                emailError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-cyan-500"
              } placeholder:text-[#A4A4A4] text-gray-700`}
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="mb-6 relative">
            <input
              type={showRePassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors text-sm sm:text-base"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowRePassword(!showRePassword)}
              disabled={isLoading}
            >
              {showRePassword ? (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || emailError}
            className="w-full py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full max-w-md mt-8 lg:mt-12 mb-4 border-t border-gray-200"></div>

        {/* Terms and Privacy Policy */}
        <div className="text-center text-xs sm:text-sm text-gray-500 px-4">
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

      {/* Right Side - Background Image */}
      <div className="w-full lg:w-1/2 min-h-[250px] sm:min-h-[300px] lg:min-h-screen bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex items-center justify-center relative overflow-hidden lg:rounded-tl-xl lg:rounded-br-xl order-1 lg:order-2">
        <div className="w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center transform scale-x-[-1]">
            <Image
              src="/assets/loginImgg.png"
              alt="Main Logo"
              width={400}
              height={280}
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;