import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

export const metadata: Metadata = {
  title: "FarmIQ — Autonomous Farmer Decision Intelligence Agent",
  description: "AI-powered platform combining weather, soil, and market data to provide farmers with intelligent crop selection, irrigation scheduling, and yield predictions.",
  keywords: "agriculture, AI, crop recommendation, irrigation, yield prediction, smart farming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
