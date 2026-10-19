import type { Metadata } from "next";
import RefundCancellationPolicy from "@/components/sections/RefundCancellationPolicy";

export const metadata: Metadata = {
  title: "Refund Cancellation Policy",
  description: "How cancellations and refunds work for Lestow plans.",
};

export default function RefundCancellationPolicyPage() {
  return <RefundCancellationPolicy />;
}
