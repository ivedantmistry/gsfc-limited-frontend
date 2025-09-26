"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  FlaskConical,
  BarChart,
  Server,
  PlusCircle,
  FileText,
  Settings,
} from "lucide-react";

// --- Re-engineered Components for macOS Style ---

// A highly reusable Widget container component
const Widget = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  // REVAMPED: macOS-style widget container. Subtle border, no heavy shadows.
  <div
    className={`bg-white/80 rounded-xl border border-slate-200/70 ${className}`}
  >
    <div className="px-5 py-3 border-b border-slate-200/70">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// A component for the large, clickable action buttons
const QuickActionButton = ({
  icon: Icon,
  label,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) => (
  <button className="flex items-center gap-4 w-full p-4 rounded-lg hover:bg-slate-100/80 transition-colors text-left">
    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </button>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* The main page header is now inside the content area */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="text-slate-500 mt-1 text-lg">
          Here's what's happening in your lab today.
        </p>
      </div>

      {/* REVAMPED: A more dynamic and visually interesting grid layout for widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Widget title="Quick Actions" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionButton
              icon={PlusCircle}
              label="New Analysis"
              description="Start a new product analysis."
            />
            <QuickActionButton
              icon={BarChart}
              label="View Inventory"
              description="Browse all products."
            />
            <QuickActionButton
              icon={FileText}
              label="Generate Report"
              description="Create a new lab report."
            />
            <QuickActionButton
              icon={Settings}
              label="Manage Settings"
              description="Adjust lab parameters."
            />
          </div>
        </Widget>

        <Widget title="System Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">API Service</span>
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                Operational
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">Database</span>
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                Connected
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-600">Last Backup</span>
              <p className="text-sm text-slate-500">Today, 1:00 PM</p>
            </div>
          </div>
        </Widget>

        <Widget title="Recent Analyses" className="lg:col-span-3">
          <div className="text-center py-10">
            <FlaskConical className="mx-auto w-12 h-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-600">
              No recent analyses
            </p>
            <p className="text-sm text-slate-400">
              New analyses will appear here once recorded.
            </p>
          </div>
        </Widget>
      </div>
    </div>
  );
}
