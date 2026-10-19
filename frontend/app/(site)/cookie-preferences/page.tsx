import type { Metadata } from "next";
import CookiePreferences from "@/components/sections/CookiePreferences";

export const metadata: Metadata = {
  title: "Cookie Preferences",
  description: "Choose which optional cookies Lestow can use on this device.",
};

export default function CookiePreferencesPage() {
  return <CookiePreferences />;
}
