"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FlaskConical, BarChart, PlusCircle, Settings } from "lucide-react";

const Widget = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/80 rounded-xl border border-slate-200/70 ${className}`}
  >
    <div className="px-5 py-3 border-b border-slate-200/70">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const QuickActionButton = ({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 rounded-lg hover:bg-slate-100/80 transition-colors text-left"
  >
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
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="text-slate-500 mt-1 text-lg">
          Here's what's happening in your lab today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Widget title="Quick Actions" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionButton
              icon={PlusCircle}
              label="New Analysis"
              description="Start a new product analysis."
               onClick={() => router.push("/dashboard/records")}
            />
            <QuickActionButton
              icon={BarChart}
              label="View Quality Trend"
              description="See how products are performing"
              onClick={() => router.push("/dashboard/quality-trends")}
            />
            <QuickActionButton
              icon={FlaskConical}
              label="View Products"
              description="Browse all products."
              onClick={() => router.push("/dashboard/products")}
            />
            <QuickActionButton
              icon={Settings}
              label="Alerts"
              description="View & Resolve recent Alerts."
              onClick={() => router.push("/dashboard/alerts")}
            />
          </div>
        </Widget>
        
      </div>
    </div>
  );
}
