import React from "react";

/**
 * Layout for the Test Result Entry page.
 * This provides a consistent container for the page content.
 */
export default function TestEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>;
}

