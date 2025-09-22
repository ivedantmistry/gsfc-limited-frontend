"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/useHasPermission";

// Simple Icon component
const Icon = ({ path, className = "w-4 h-4" }: { path: string, className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d={path}></path></svg>
);

const TopMenuBar = () => {
    const { user, logout } = useAuth();
    const canViewUsers = useHasPermission('authentication.view_user_list');

    return (
        <header className="fixed top-0 left-0 right-0 h-10 bg-gray-100/80 backdrop-blur-sm border-b border-gray-300/80 flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                {/* GSFC Logo - Apple-like styling */}
                <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    <span className="font-bold text-sm text-gray-800">GSFC LTD</span>
                </div>
                <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <a href="/dashboard" className="hover:text-gray-900">Dashboard</a>
                    {canViewUsers && <a href="/dashboard/users" className="hover:text-gray-900">Users</a>}
                    <a href="/dashboard/inventory" className="hover:text-gray-900">Inventory</a>
                </nav>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome, {user?.first_name || user?.username}</span>
                <button 
                    onClick={logout} 
                    className="p-1.5 rounded-full hover:bg-gray-200/80 transition-colors"
                    title="Sign Out"
                >
                    <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </button>
            </div>
        </header>
    );
};


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // 1. While loading, show a blank screen or a loader to prevent flicker
  if (isLoading) {
    return <div className="min-h-screen bg-[#f6f6f6]"></div>;
  }

  // 2. If not loading and no user, redirect to login
  if (!user) {
    router.replace("/");
    return null; // Return null to prevent rendering anything
  }

  // 3. If authenticated, render the dashboard layout
  return (
    <div className="min-h-screen bg-[#f6f6f6] font-sans">
        <TopMenuBar />
        <main className="pt-16 px-8">
            {children}
        </main>
    </div>
  );
}
