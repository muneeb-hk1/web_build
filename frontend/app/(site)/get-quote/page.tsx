import type { Metadata } from "next";
import GetQuotePage from "@/components/sections/GetQuotePage";

export const metadata: Metadata = {
  title: "Get Quote",
  description: "Tell Lestow about your project and request a quote.",
};

export default function GetQuoteRoute() {
  return <GetQuotePage />;
}
