"use client";

import { useAuth } from "@/hooks/useAuth";

// A simple card component for the dashboard
const DashboardCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    // STYLE: Cleaner, more spacious card design
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
        <div>{children}</div>
    </div>
);

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, {user?.first_name || user?.username}!
                </h1>
                <p className="text-gray-500 mt-2 max-w-xl">
                    Here's a summary of the latest activities in the chemical analysis lab.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard title="Recent Analyses">
                    <p className="text-sm text-gray-600">No new analyses recorded today.</p>
                </DashboardCard>
                <DashboardCard title="Inventory Levels">
                    <p className="text-sm text-gray-600">All product levels are within acceptable ranges.</p>
                </DashboardCard>
                <DashboardCard title="System Status">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        {/* STYLE: Apple-like LED status indicator */}
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        All systems operational.
                    </p>
                </DashboardCard>
            </div>
        </div>
    );
}