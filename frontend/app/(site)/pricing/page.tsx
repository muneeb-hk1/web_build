import type { Metadata } from "next";
import PricingPage from "@/components/sections/PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free on a shared URL, then pick Starter, Professional, Business, or Enterprise by theme page size.",
};

export default function PricingRoute() {
  return <PricingPage />;
}
