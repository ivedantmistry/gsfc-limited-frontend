// src/components/alerts/AlertInfoCard.tsx

import React from "react";
import Link from "next/link";
import { AlertDetail } from "@/lib/types/alert.types";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface InfoRowProps { label: string; value: React.ReactNode; }

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="grid grid-cols-3 gap-4">
    <p className="text-sm font-medium text-slate-500 col-span-1">{label}</p>
    <p className="text-sm text-slate-800 text-right col-span-2">{value || "N/A"}</p>
  </div>
);

interface AlertInfoCardProps {
  alert: AlertDetail;
}

export default function AlertInfoCard({ alert }: AlertInfoCardProps) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Alert Information</h3>
      </div>
      <div className="p-4 space-y-4">
        <InfoRow label="Product" value={alert.product_name} />
        <InfoRow label="Sample ID" value={<span className="font-mono">{alert.details.sample_id}</span>} />
        <InfoRow label="Parameter" value={alert.details.parameter_name} />
        <InfoRow label="Expected Range" value={<span className="font-mono">{alert.details.normal_range}</span>} />
        <InfoRow label="Actual Value" value={<span className="font-bold text-red-600">{alert.details.value_entered}</span>} />
      </div>
      <div className="p-4 border-t bg-slate-50">
        <Link href={`/dashboard/records/${alert.test_record_data.id}`}>
          <Button variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4"/>
            View Full Test Record
          </Button>
        </Link>
      </div>
    </div>
  );
}