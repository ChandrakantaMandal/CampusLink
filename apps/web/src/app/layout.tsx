import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import PwaRegistration from "@/components/pwa-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAMPUSLINK — AI-Powered Campus Placement Management Platform",
  description: "CAMPUSLINK connects students, recruiters, and placement officers with AI readiness scoring, skill gap analysis, and intelligent drive management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PwaRegistration />

        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
