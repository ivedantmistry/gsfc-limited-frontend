"use client";

import { useAuth } from "@/hooks/useAuth";
// NEW: Importing icons for the cards
import { FlaskConical, BarChart, Server } from "lucide-react";

// A simple card component for the dashboard
const DashboardCard = ({ 
    title, 
    children,
    icon: Icon 
}: { 
    title: string, 
    children: React.ReactNode,
    icon: React.ComponentType<{ className?: string }> 
}) => (
    // REVAMPED: Cleaner card design with a softer shadow and no border.
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="flex items-center gap-4">
            {/* NEW: Icon for each card */}
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                <div className="text-sm text-slate-500">{children}</div>
            </div>
        </div>
    </div>
);

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-10">
            <div>
                {/* REVAMPED: Improved typography and spacing for the header */}
                <h1 className="text-4xl font-bold text-slate-900">
                    Welcome back, {user?.first_name || user?.username}!
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Here's a summary of the latest activities in your lab.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* REVAMPED: Cards now use the new icon prop */}
                <DashboardCard title="Recent Analyses" icon={FlaskConical}>
                    <p>No new analyses recorded today.</p>
                </DashboardCard>
                
                <DashboardCard title="Inventory Levels" icon={BarChart}>
                    <p>All product levels are stable.</p>
                </DashboardCard>
                
                <DashboardCard title="System Status" icon={Server}>
                    <div className="flex items-center gap-2">
                        {/* STYLE: Apple-like LED status indicator */}
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        All systems operational.
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}