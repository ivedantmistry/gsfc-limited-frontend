import React from "react";

export const TestRecordSkeletonRow = () => (
  <tr className="animate-pulse bg-white border-b">
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded w-2/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-slate-200 rounded-full w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 rounded w-3/5"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 w-8 bg-slate-200 rounded-md"></div>
    </td>
  </tr>
);