import type { Metadata } from "next";
import HelpCenter from "@/components/sections/HelpCenter";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers for building, editing, publishing, and managing your Lestow website.",
};

export default function HelpCenterPage() {
  return <HelpCenter />;
}
