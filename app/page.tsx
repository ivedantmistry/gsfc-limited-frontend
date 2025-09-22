"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

// A simple icon component for the user and lock icons
const Icon = ({ path, className = 'w-5 h-5' }: { path: string, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in and auth state is determined
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login({ username, password });
      // The redirect to /dashboard is handled by the login function in AuthContext
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Render a loading state or nothing while checking auth status to avoid flashes
  if (isLoading || (!isLoading && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {/* Optional: Add a subtle loading spinner here */}
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-[#f6f6f6] font-sans">
      <div className="w-full max-w-xs mx-auto p-4">
        <div className="text-center mb-10">
          {/* A placeholder for the company logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-2xl mb-4">
             <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">GSFC LTD</h1>
          <p className="text-gray-500 mt-1 text-sm">Analysis Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-sm"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Icon path="M12 1.5A5.5 5.5 0 006.5 7v3.5H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-1.5V7A5.5 5.5 0 0012 1.5zM17 10.5H7V7a5 5 0 0110 0v3.5z" className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 ease-in-out text-sm"
            />
          </div>

          {error && (
            <div className="text-red-600 text-xs text-center py-1">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full font-semibold py-3 px-4 text-white rounded-lg transition duration-200 ease-in-out bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm"
            >
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
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