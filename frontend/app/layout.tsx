import type { Metadata, Viewport } from "next";
import { agrandirBolt, generalSansMedium } from "./fonts";
import GoogleAdsTag from "@/components/GoogleAdsTag";
import "./globals.css";
import "./main.css";

const appUrl =
  process.env.NEXT_PUBLIC_PUBLISH_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AI Website Builder - Build a Website in 10 Minutes | Lestow",
    template: "%s | Lestow",
  },
  description:
    "Build a professional website in 10 minutes with Lestow AI Website Builder. Create, customize, redesign and publish your website with AI - no coding required.",
  icons: {
    icon: [{ url: "/fav-icon.ico", type: "image/x-icon" }],
    shortcut: "/fav-icon.ico",
  },
  openGraph: {
    type: "website",
    title: "Lestow — AI Website Builder",
    description:
      "Build a professional website in 10 minutes with Lestow AI Website Builder. Create, customize, redesign and publish your website with AI - no coding required.",
    siteName: "Lestow",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2855ed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`min-h-full ${generalSansMedium.className} ${agrandirBolt.variable}`}
    >
      <body
        className={`min-h-dvh overflow-x-hidden ${generalSansMedium.className}`}
      >
        <GoogleAdsTag />
        {children}
      </body>
    </html>
  );
}
