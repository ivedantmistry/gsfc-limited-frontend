import React from "react";

export const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-4 w-12">
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-2/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </td>
  </tr>
);