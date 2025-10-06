import React from "react";

interface FilterContainerProps {
  children: React.ReactNode;
}

export function FilterContainer({ children }: FilterContainerProps) {
  return (
    <div className="p-4 border bg-card rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-3 items-end">
        {children}
      </div>
    </div>
  );
}