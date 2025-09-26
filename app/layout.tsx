import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GSFC LTD Laboratory Portal",
  description: "Chemical Analysis and Inventory Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* REVAMPED: Switched to the softer 'bg-slate-50' and set a default text color for the app */}
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}