// /app/dashboard/layout.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useHasPermission } from "@/context/AuthContext";
import { navItems } from "@/config/navItems";
import { LogOut, Settings, Bell, Menu } from "lucide-react";

// --- Components ---

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
    <Link href={href} className="block px-3">
      <span
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
          isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </span>
    </Link>
  );
};

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const { user, logout } = useAuth();
  const hasPermission = useHasPermission;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2.5 h-16 border-b border-slate-200 px-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {user?.username}
          </p>
          <p className="text-xs text-slate-500">GSFC Laboratory</p>
        </div>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {navItems
          .filter((item) => !item.permission || hasPermission(item.permission))
          .map((item) => (
            <SidebarLink key={item.href} {...item} />
          ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-sm font-medium w-full text-slate-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

const AppToolbar = ({
  isSidebarOpen,
  setSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between h-16 bg-white backdrop-blur-md border-b border-slate-200/80 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

// --- Skeleton Loader Updated for the New Layout ---

const DashboardSkeleton = () => (
  <div className="h-screen w-screen flex bg-slate-100 font-sans">
    {/* MODIFIED: Sidebar skeleton is now hidden on small screens */}
    <aside className="hidden lg:block h-full w-64 bg-white border-r border-slate-200 animate-pulse"></aside>
    <div className="flex-1 flex flex-col">
      <header className="flex-shrink-0 h-16 bg-white border-b border-slate-200 animate-pulse"></header>
      <main className="flex-1 p-8 space-y-8 animate-pulse">
        <div className="h-10 w-1/3 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-48 col-span-2 bg-slate-200 rounded-xl"></div>
          <div className="h-48 bg-slate-200 rounded-xl"></div>
          <div className="h-48 bg-slate-200 rounded-xl"></div>
        </div>
      </main>
    </div>
  </div>
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    // Main background is light gray, making the white sidebar and content cards pop.
    <div className="h-screen w-screen flex bg-slate-50 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AppToolbar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
