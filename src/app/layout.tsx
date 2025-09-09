import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
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
  title: {
    default: "MIMESISS 2025 - Military Medicine Scientific Session for Students",
    template: "%s | MIMESISS 2025"
  },
  description: "Cea de-a V-a ediție a Sesiunii de Comunicări Științifice Medico-Militare (MIMESISS 2025). 13-16 Noiembrie 2025 la Spitalul universitar de urgență militar central Dr. Carol Davila. Platformă pentru dezvoltare personală și profesională în medicina militară.",
  keywords: [
    "MIMESISS",
    "MIMESISS 2025",
    "medicina militară",
    "conferință medicală",
    "studenți medicină",
    "comunicări științifice",
    "ASMM",
    "Dr. Carol Davila",
    "noiembrie 2025",
    "congres medical",
    "cercetare medicală",
    "medicină de urgență"
  ],
  authors: [{ name: "Asociația Studenților în Medicină-Militară (ASMM)" }],
  creator: "ASMM",
  publisher: "ASMM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://mimesiss.ro",
    siteName: "MIMESISS 2025",
    title: "MIMESISS 2025 - Military Medicine Scientific Session for Students",
    description: "Cea de-a V-a ediție a Sesiunii de Comunicări Științifice Medico-Militare. 13-16 Noiembrie 2025 la Spitalul militar central Dr. Carol Davila.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MIMESISS 2025 - Conferința de medicină militară pentru studenți",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIMESISS 2025 - Military Medicine Scientific Session for Students",
    description: "Cea de-a V-a ediție a Sesiunii de Comunicări Științifice Medico-Militare. 13-16 Noiembrie 2025.",
    images: ["/og-image.jpg"],
    creator: "@asmm_romania",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "healthcare",
  classification: "Medical Conference",
  other: {
    "event-date": "2025-11-13",
    "event-location": "Spitalul universitar de urgență militar central Dr. Carol Davila",
    "event-type": "Medical Conference",
    "target-audience": "Medical Students",
  },
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
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
