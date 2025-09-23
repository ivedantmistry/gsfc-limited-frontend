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
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <span
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? "bg-gray-300 text-gray-900"
            : "text-gray-600 hover:bg-gray-300/70 hover:text-gray-900"
        }`}
      >
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
    <aside className="fixed top-0 left-0 h-full w-72 bg-gray-200/90 backdrop-blur-sm border-r border-gray-300/50 flex flex-col z-40 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 h-20 border-b border-gray-300/50 px-6">
        <svg
          className="w-8 h-8 text-gray-600"
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
        <span className="font-medium text-xl text-gray-800">GSFC LTD</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems
          .filter(
            (item) =>
              // An item is shown if it has NO permission OR the user has the required permission.
              !item.permission || hasPermission(item.permission)
          )
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
      <div className="mt-auto p-6 border-t border-gray-300/50">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-base">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.username}
            </span>
          </div>
          <div className="flex justify-between">
            <button
              className="p-2 rounded-xl hover:bg-gray-300/70"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-red-100/70"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen bg-gray-50"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="ml-72 p-10">{children}</main>
    </div>
  );
}
