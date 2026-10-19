import type { Metadata } from "next";
import ShippingPolicy from "@/components/sections/ShippingPolicy";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "How Lestow delivers websites, files, and account access.",
};

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}
