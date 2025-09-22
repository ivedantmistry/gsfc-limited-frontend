"use client";

import { useAuth } from "@/hooks/useAuth";

// A simple card component for the dashboard
const DashboardCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white/80 rounded-xl border border-gray-200/80 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <div>{children}</div>
    </div>
);

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-gray-600">
                Here's a summary of the latest activities in the chemical analysis lab.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard title="Recent Analyses">
                    <p className="text-sm text-gray-500">No new analyses recorded today.</p>
                </DashboardCard>
                <DashboardCard title="Product Inventory Levels">
                    <p className="text-sm text-gray-500">All product levels are within acceptable ranges.</p>
                </DashboardCard>
                <DashboardCard title="System Status">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        All systems operational.
                    </p>
                </DashboardCard>
            </div>
        </div>
    );
}
