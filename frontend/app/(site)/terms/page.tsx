import type { Metadata } from "next";
import TermsOfService from "@/components/sections/TermsOfService";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Lestow.",
};

export default function TermsPage() {
  return <TermsOfService />;
}
