import Link from "next/link";
import LegalDocument from "./LegalDocument";
import SitePageShell from "./SitePageShell";

const sections = [
  {
    title: "Cancellations",
    body: "You can cancel a Lestow subscription from your account before the next billing date. Access continues until the end of the period you already paid for.",
  },
  {
    title: "Refunds",
    body: "If a charge was made in error, or a paid plan could not be delivered because of a problem on our side, contact us within 14 days and we will review a refund.",
  },
  {
    title: "What is not refunded",
    body: "Custom work that has already been delivered, domain purchases, and time already used on a plan are not refunded, except where the law requires it.",
  },
  {
    title: "How to request",
    body: "Send the account email, the charge date, and a short note through the Get Quote page. We reply with the outcome of the review.",
  },
];

export default function RefundCancellationPolicy() {
  return (
    <SitePageShell
      title={
        <>
          Refund <span className="text-blue-600">Cancellation</span>
        </>
      }
      subtitle="How cancellations and refunds work for Lestow plans."
      cta={{ label: "Get Quote", href: "/get-quote" }}
      bandTitle="A short guide to cancelling a plan and requesting a refund."
    >
      <LegalDocument updatedAt="October 9, 2026" sections={sections} />
      <p className="mx-auto max-w-[760px] px-5 pb-20 text-sm text-neutral-600 sm:px-8">
        Questions about a charge? Open{" "}
        <Link href="/get-quote" className="font-medium text-blue-600 hover:underline">
          Get Quote
        </Link>
        .
      </p>
    </SitePageShell>
  );
}
