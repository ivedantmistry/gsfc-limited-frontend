import React from "react";

// This layout simply passes the children through, inheriting the main dashboard layout.
export default function ProductVersionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}