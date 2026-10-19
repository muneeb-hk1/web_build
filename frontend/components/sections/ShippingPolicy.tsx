import Link from "next/link";
import LegalDocument from "./LegalDocument";
import SitePageShell from "./SitePageShell";

const sections = [
  {
    title: "Digital delivery",
    body: "Lestow websites, templates, and account access are delivered online. There is no physical shipment for a standard plan.",
  },
  {
    title: "When access starts",
    body: "Paid features are available in your account after payment is confirmed. A published site goes live when you choose to publish it.",
  },
  {
    title: "Custom work",
    body: "If a project includes files or assets prepared for you, we send them through your account or by email. Timing is confirmed when the work is agreed.",
  },
  {
    title: "Delays",
    body: "If delivery is delayed because of a problem on our side, we will tell you and either complete the delivery or review a refund under the refund policy.",
  },
];

export default function ShippingPolicy() {
  return (
    <SitePageShell
      title={
        <>
          Shipping <span className="text-blue-600">Policy</span>
        </>
      }
      subtitle="How Lestow delivers websites, files, and account access."
      cta={{ label: "Get Quote", href: "/get-quote" }}
      bandTitle="A short guide to how digital orders are delivered."
    >
      <LegalDocument updatedAt="October 9, 2026" sections={sections} />
      <p className="mx-auto max-w-[760px] px-5 pb-20 text-sm text-neutral-600 sm:px-8">
        Need something delivered a different way? Open{" "}
        <Link href="/get-quote" className="font-medium text-blue-600 hover:underline">
          Get Quote
        </Link>
        .
      </p>
    </SitePageShell>
  );
}
