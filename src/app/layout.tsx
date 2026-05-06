import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "@/components/shared/AuthGuard";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Innrspark",
  description: "Mobile-first career discovery app.",
  manifest: "/manifest.json",
  applicationName: "Innrspark",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Innrspark",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFD700",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
