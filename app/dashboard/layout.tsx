"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useHasPermission } from "@/context/AuthContext";
import { navItems } from "@/config/navItems";
import { LogOut, Menu, Keyboard } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  GlobalModalProvider,
  useGlobalModal,
} from "@/context/GlobalModalContext";
import { useKeyPress } from "@/hooks/useKeyPress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { KeyboardShortcutsModal } from "@/components/shared/KeyboardShortcutsModal";

const GlobalShortcutHandler = () => {
  const { openCreateTestModal } = useGlobalModal();
  useKeyPress("i", openCreateTestModal, "ctrlKey");
  return null;
};

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
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-indigo-500 text-white text-sm font-bold">
            {`${user?.first_name?.charAt(0) ?? ""}${
              user?.last_name?.charAt(0) ?? ""
            }`.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {user?.first_name || user?.last_name
              ? `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
              : user?.username}
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
      {/* ✅ 3. Replaced the simple button with the Dialog trigger */}
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-2 rounded-full text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
              aria-label="Open keyboard shortcuts"
            >
              <Keyboard className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <KeyboardShortcutsModal />
        </Dialog>
      </div>
    </header>
  );
};

const DashboardSkeleton = () => (
  <div className="h-screen w-screen flex bg-slate-100 font-sans">
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
    <GlobalModalProvider>
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
        <GlobalShortcutHandler />
      </div>
    </GlobalModalProvider>
  );
}
