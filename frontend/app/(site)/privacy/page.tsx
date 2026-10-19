import type { Metadata } from "next";
import PrivacyPolicy from "@/components/sections/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lestow collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
