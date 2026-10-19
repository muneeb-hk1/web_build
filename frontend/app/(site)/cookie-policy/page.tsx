import type { Metadata } from "next";
import CookiePolicy from "@/components/sections/CookiePolicy";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Lestow uses cookies and how you can control them.",
};

export default function CookiePolicyPage() {
  return <CookiePolicy />;
}
