"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useHasPermission } from "@/hooks/useHasPermission";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { navItems } from "@/config/navItems";

// A reusable component for sidebar navigation links
const SidebarLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className="block">
      {/* REVAMPED: Active link style is more pronounced with a background and a side indicator. */}
      <span
        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-slate-700 text-white"
            : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
        }`}
      >
        {/* NEW: Active state indicator bar for a modern look */}
        {isActive && <div className="absolute left-0 h-6 w-1 bg-indigo-400 rounded-r-full"></div>}
        <Icon className="w-5 h-5" />
        {label}
      </span>
    </Link>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const hasPermission = useHasPermission;

  return (
    // REVAMPED: Darker sidebar for better contrast and a premium feel.
    <aside className="fixed top-0 left-0 h-full w-72 bg-slate-800 border-r border-slate-700/60 flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center gap-3 h-20 border-b border-slate-700/50 px-6">
        <svg
          className="w-8 h-8 text-indigo-400" // NEW: Added an accent color to the logo
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
        <span className="font-semibold text-xl text-slate-100">GSFC LTD</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems
          .filter((item) => !item.permission || hasPermission(item.permission))
          .map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
      </nav>

      {/* Footer / User Area */}
      <div className="mt-auto p-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
             {/* REVAMPED: User avatar with accent color */}
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-100">
                  {user?.username}
                </span>
                <span className="text-xs text-slate-400">{user?.email || 'user@email.com'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

// NEW: A simple skeleton loader component
const DashboardSkeleton = () => (
    <div className="min-h-screen bg-slate-50 font-sans">
        <aside className="fixed top-0 left-0 h-full w-72 bg-slate-200 animate-pulse"></aside>
        <main className="ml-72 p-8">
            <div className="space-y-8">
                <div>
                    <div className="h-8 w-1/3 bg-slate-200 rounded-lg animate-pulse mb-3"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
                    <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
                    <div className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
                </div>
            </div>
        </main>
    </div>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    // REVAMPED: Using a skeleton loader for a better loading experience
    return <DashboardSkeleton />;
  }

  return (
    // REVAMPED: Changed background for a softer, cleaner look
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="ml-72 p-8">{children}</main>
    </div>
  );
}