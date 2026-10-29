import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { createPageMetadata, siteDescription, siteName, siteUrl } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#f0f9ff',
};

export const metadata: Metadata = {
  ...createPageMetadata({ path: '/' }),
  metadataBase: siteUrl,
  applicationName: siteName,
  appleWebApp: { title: siteName, capable: false },
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  // Google Search Console の所有権確認（HTMLタグ方式）。消すと確認が外れるので残しておく
  verification: { google: 'OMn9XRkaR7FK1S3WZGQvKR4Uhhh5l8Z7alL6gMPiHR8' },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
