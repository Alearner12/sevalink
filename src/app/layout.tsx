import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SevaLink - सेवालिंक | Unified Citizen Complaint Portal",
  description: "Connecting Citizens to Government Services - File, track, and resolve complaints across all government departments in a single portal.",
  keywords: ["government", "complaint", "citizen services", "Bihar", "Digital India", "SevaLink"],
  authors: [{ name: "SevaLink Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  robots: "index, follow",
  openGraph: {
    title: "SevaLink - सेवालिंक | Unified Citizen Complaint Portal",
    description: "Connecting Citizens to Government Services",
    type: "website",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.className} h-full bg-gray-50`}>
        <div className="min-h-full">
        {children}
        </div>
      </body>
    </html>
  );
}
