import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryAppProvider from "./provider/queryprovider";
import ShuffledAds from "@/components/shared/ShuffledAds";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Picha - Cloud Event Photo & Video Sharing Platform | QR Code Event Media",
  description:
    "Picha is the ultimate cloud platform for sharing event photos and videos. Generate QR codes for guests to upload, view, and download media from weddings, conferences, parties, concerts, and corporate events instantly.",

  // Essential SEO meta tags
  keywords: [
    "event photo sharing",
    "cloud photo gallery",
    "QR code photo sharing",
    "event media platform",
    "wedding photo sharing",
    "conference photo gallery",
    "party photo upload",
    "event video sharing",
    "group photo sharing",
    "instant photo sharing",
    "event photography platform",
    "guest photo upload",
    "church event photos",
    "concert photo sharing",
    "corporate event gallery",
  ].join(", "),

  authors: [{ name: "Picha Team" }],
  creator: "Picha",
  publisher: "Picha",

  // Open Graph tags for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.picha.fun", // Replace with your actual domain
    siteName: "Picha",
    title: "Picha - Cloud Event Photo & Video Sharing Platform",
    description:
      "Transform your events with Picha's QR code photo sharing. Guests can instantly upload, view, and download event photos and videos. Perfect for weddings, conferences, parties, and corporate events.",
    images: [
      {
        url: "/picha-logo.png", // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: "Picha - Event Photo Sharing Platform",
      },
    ],
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    site: "@picha", // Replace with your Twitter handle
    creator: "@picha",
    title: "Picha - Cloud Event Photo & Video Sharing Platform",
    description:
      "QR code-powered event photo sharing. Guests upload, view & download instantly. Perfect for any gathering!",
    images: ["/twitter-image.jpg"], // Create this image (1200x600px)
  },

  // Additional SEO tags
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

  // Verification tags (add your actual verification codes)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },

  // App-specific metadata
  applicationName: "Picha",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Picha",
  },

  // Additional meta tags
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },

  // Canonical URL
  alternates: {
    canonical: "https://picha.fun", // Replace with your actual domain
  },

  // Category for better categorization
  category: "technology",
};

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <html lang="en">
        <head>
          {/* Favicon and App Icons */}
          <link
            rel="shortcut icon"
            href="/picha-logo.png"
            type="image/png"
            sizes="any"
          />
          <link
            rel="icon"
            href="/picha-logo.png"
            type="image/png"
            sizes="any"
          />
          <link rel="apple-touch-icon" href="/picha-logo.png" sizes="180x180" />
          <link rel="manifest" href="/manifest.json" />

          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />

          {/* Schema.org structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Picha",
                applicationCategory: "MultimediaApplication",
                operatingSystem: "Web",
                description:
                  "Cloud-based event photo and video sharing platform with QR code technology for instant guest uploads and downloads.",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  ratingCount: "150",
                },
                author: {
                  "@type": "Organization",
                  name: "Picha Team",
                },
                datePublished: "2025",
                softwareVersion: "1.0",
                url: "https://picha.fun",
              }),
            }}
          />

          {/* Additional event-specific structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Picha Event Media Sharing",
                description:
                  "Upload, share, and download event photos and videos instantly using QR codes. Perfect for weddings, conferences, parties, concerts, and corporate events.",
                applicationCategory: "EventManagement",
                browserRequirements: "Requires JavaScript. Requires HTML5.",
                screenshot: "https://picha.fun/screenshot.png",
                softwareVersion: "1.0",
                operatingSystem: "All",
                permissions: "Camera access for photo uploads",
                storageRequirements: "Cloud-based storage",
              }),
            }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryAppProvider>
            <Toaster />
            {children}
            <ShuffledAds adUrl="https://www.rentville.ng" />
          </QueryAppProvider>
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
