import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastProvider } from "@/components/ui/ToastProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mimesiss",
  description: "A modern workshop management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground min-h-screen`}
        >
          <ToastProvider>
            <HeaderWrapper />
            {children}
          </ToastProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
