"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, KeyRound, Eye, EyeOff, LoaderCircle } from "lucide-react";
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
        setError("Login failed. Please check credentials and try again or server is temporarily down.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoading || (!isLoading && user)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoaderCircle className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const inputStyles =
    "block w-full rounded-lg border-0 bg-white py-3 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 sm:text-sm transition-shadow duration-150";

  return (
    <main className="flex items-center justify-center min-h-screen w-full p-4 bg-slate-50 relative overflow-hidden">
      {/* This background is consistent with our standalone pages like 404 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-500/5 rounded-full blur-3xl"></div>

      {/* REVAMPED: Panel styling adjusted to match the macOS widget aesthetic.
          - Softer rounding (rounded-xl)
          - More subtle shadow (shadow-lg shadow-slate-900/5)
          - Cleaner border (border-slate-200/70) */}
      <div className="relative w-full max-w-sm mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-xl border border-slate-200/70 shadow-lg shadow-slate-900/5">
        <div className="text-center mb-10">
          <div className="mb-6">
            <Image
              src={logo}
              alt="GSFC LTD Logo"
              width={250}
              height={250}
              className="mx-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            GSFC LTD
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Laboratory Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-slate-400" />
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
              <KeyRound className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`${inputStyles} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg text-center">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full font-medium py-3 px-4 text-white rounded-lg transition-all duration-200 ease-in-out bg-slate-800 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn && <LoaderCircle className="w-5 h-5 animate-spin" />}
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
