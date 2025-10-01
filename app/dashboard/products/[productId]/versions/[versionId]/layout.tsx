import React from "react";

// Layout for the specific version management page.
export default function VersionDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Added a container for consistent padding
  return <div className="mx-auto max-w-7xl">{children}</div>;
}