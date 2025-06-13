"use client";

import "@/app/globals.css";
import Image from "next/image";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear alert after 5 seconds
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: "", type: "" });
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email before submitting
    if (!validateEmail(email)) {
      showAlert("Format email tidak valid", "error");
      return;
    }

    setIsLoading(true);
    setAlert({ message: "", type: "" });

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

        showAlert("Login berhasil! Mengalihkan...", "success");

        setTimeout(() => {
          if (
            user.learning_style === null ||
            user.learning_style === undefined
          ) {
            window.location.href = "/welcome-test";
          } else {
            window.location.href = "/dashboard";
          }
        }, 1500);
      } else {
        showAlert(data.message || "Login gagal", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Terjadi kesalahan saat login", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100 lg:flex-row flex-col">
      {/* Left Side - Image Section */}
      <div className="lg:w-1/2 w-full h-64 lg:h-screen bg-gradient-to-b from-[#7FD8E8] to-[#0798C5] flex items-center justify-center relative overflow-hidden lg:rounded-tr-xl lg:rounded-br-xl">
        <div className="w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/loginImgg.png"
              alt="Main Logo"
              width={500}
              height={350}
              className="w-full max-w-md lg:max-w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Logo */}
        <div className="mb-6 lg:mb-8 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <Image
              src="/assets/mainLogo.png"
              alt="Main Logo"
              width={60}
              height={60}
              className="lg:w-[150px] lg:h-[60px]"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-2 lg:mb-2">
          <h1 className="text-xl lg:text-2xl font-medium text-cyan-500 mb-1">
            Selamat datang kembali
          </h1>
          <p className="text-gray-400 text-sm">
            Baru di StudyFinder?{" "}
            <Link href="/register" className="text-cyan-500 hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </div>

        {/* Alert Space - Fixed height to prevent layout shift */}
        <div className="w-full max-w-md mb-4 h-12 flex items-center justify-center">
          {alert.message && (
            <div
              className={`w-full px-4 py-2 rounded-md text-sm text-center transition-all duration-300 ${
                alert.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {alert.message}
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-md mb-8 lg:mb-20">
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-1 transition-colors ${
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

          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 placeholder:text-[#A4A4A4] text-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
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
            className="w-full py-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              "Masuk"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full max-w-md mb-4 border-t border-gray-200"></div>

        {/* Terms and Privacy Policy */}
        <div className="text-center text-xs lg:text-sm text-gray-500 pt-8 lg:pt-20 px-4">
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
