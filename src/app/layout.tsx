import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
  weight: "300 400 500 600 700",
});

export const metadata: Metadata = {
  title: {
    default: "TMT OFFICIAL — Elite Gaming & Cinematic Let's Plays",
    template: "%s | TMT OFFICIAL",
  },
  description: "Experience elite gaming content, cinematic let's plays, and next-level challenges. Join the TMT community.",
  keywords: ["gaming", "lets play", "walkthrough", "challenges", "TMT", "youtube"],
  authors: [{ name: "TMT OFFICIAL" }],
  creator: "TMT OFFICIAL",
  publisher: "TMT OFFICIAL",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tmtofficial.com",
    siteName: "TMT OFFICIAL",
    title: "TMT OFFICIAL — Elite Gaming & Cinematic Let's Plays",
    description: "Experience elite gaming content, cinematic let's plays, and next-level challenges.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TMT OFFICIAL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TMT OFFICIAL",
    description: "Elite gaming content and cinematic let's plays.",
    images: ["/og-image.jpg"],
    creator: "@TMT_OFFICIAL-y2x",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#030307",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
      </head>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}