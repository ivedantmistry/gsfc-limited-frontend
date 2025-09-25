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
      {/* STYLE: Apply a clean, light gray background to the entire app */}
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}