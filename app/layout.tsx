import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GSFC LTD Laboratory Portal",
  description: "Chemical Analysis and Product Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-800`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-right" /> 
      </body>
    </html>
  );
}