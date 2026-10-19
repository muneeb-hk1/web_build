import localFont from "next/font/local";

export const agrandirBolt = localFont({
  src: "../public/fonts/agrandir-bolt.woff2",
  variable: "--font-agrandir-bolt",
  weight: "500",
  display: "swap",
});

export const generalSansMedium = localFont({
  src: "../public/fonts/GeneralSans-Medium.woff",
  variable: "--font-general-sans-medium",
  weight: "500",
  display: "swap",
  preload: true,
});
