"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // 1. Import the Next.js Image component
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, KeyRound, Eye, EyeOff } from "lucide-react";
import logo from "@/public/logo.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      await login({ username, password });
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please check credentials and try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading || (!isLoading && user)) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  // STYLE: Consistent styles for form inputs with blue focus ring
  const inputStyles =
    "block w-full rounded-md border-0 bg-white py-3 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0071e3] sm:text-sm transition-shadow duration-150";

  return (
    <main className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="w-full max-w-sm mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-gray-200/50">
        <div className="text-center mb-10">
          <div className="mb-6">
            <Image
              src={logo}
              alt="GSFC LTD Logo"
              width={250} // You can increase/decrease as needed
              height={250}
              className="mx-auto object-contain"
            />
          </div>

          {/* STYLE: Refined header typography */}
          <h1 className="text-2xl font-semibold text-gray-800">GSFC LTD</h1>
          <p className="text-gray-500 mt-1 text-sm">Laboratory Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className={inputStyles}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <KeyRound className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`${inputStyles} pr-12`} // Add extra padding for the button
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            {/* STYLE: Consistent primary action button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full font-medium py-3 px-4 text-white rounded-lg transition duration-200 ease-in-out bg-gray-900 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0071e3] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
