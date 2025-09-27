import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ToastProvider } from "@/components/ui/ToastProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import "./critical.css";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Less critical font
  fallback: ['Consolas', 'Monaco', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mimesiss.ro"),
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/icons/apple-touch-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/icons/apple-touch-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/apple-touch-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/icons/apple-touch-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/apple-touch-icon-57x57.png', sizes: '57x57', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
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
      <html lang="ro" className="dark">
        <head>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
          <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        </head>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground min-h-screen`}
        >
          <ToastProvider>
            <HeaderWrapper />
            <main>
              {children}
            </main>
          <Footer />
          </ToastProvider>
          <SpeedInsights />
          <Analytics />
          <GoogleAnalytics gaId="G-2H44Z5Z7S3" />
        </body>
      </html>
    </ClerkProvider>
  );
}
