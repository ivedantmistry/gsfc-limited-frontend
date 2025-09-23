"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// Icon component
const Icon = ({
  path,
  className = "w-5 h-5",
}: {
  path: string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
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
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show blank screen during loading or redirect
  if (isLoading || (!isLoading && user)) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-gray-50">
      <div className="w-full max-w-md mx-auto p-12 bg-white rounded-3xl shadow-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-black">GSFC LTD</h1>
          <p className="text-gray-500 mt-3 text-base font-light">
            Laboratory Portal
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon
                path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                className="w-5 h-5 text-gray-400"
              />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-100 text-black rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition duration-200 ease-in-out placeholder:font-light"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon
                path="M12 1.5A5.5 5.5 0 006.5 7v3.5H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1.5V7A5.5 5.5 0 0012 1.5zM17 10.5H7V7a5 5 0 0110 0v3.5z"
                className="w-5 h-5 text-gray-400"
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-100 text-black rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition duration-200 ease-in-out placeholder:font-light"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <Icon
                path={
                  showPassword
                    ? "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    : "M3.98 8.223A10.477 10.477 0 001.934 12c1.39 4.171 5.325 7.178 9.963 7.178 4.638 0 8.573-3.007 9.963-7.178a10.477 10.477 0 00-1.934-3.777l-2.153 2.153a3 3 0 11-4.243-4.243l-2.153-2.153z"
                }
                className="w-5 h-5"
              />
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full font-medium py-4 px-4 text-white rounded-xl transition duration-200 ease-in-out ${
                isLoggingIn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              }`}
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-400 mt-16">
          &copy; {new Date().getFullYear()} GSFC LTD. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
