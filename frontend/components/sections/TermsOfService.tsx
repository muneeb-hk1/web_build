import LegalDocument from "./LegalDocument";
import SitePageShell from "./SitePageShell";

const sections = [
  {
    title: "Agreement",
    body: "These Terms of Service govern your use of Lestow, including the website, editor, publishing tools, and related services. By creating an account or starting a site, you agree to these terms.",
  },
  {
    title: "Your account",
    body: "You are responsible for the information you provide, for keeping your login details secure, and for activity that happens under your account. Tell us promptly if you think someone else is using it.",
  },
  {
    title: "Your content",
    body: "You keep ownership of the business details, copy, images, and other materials you upload or generate with Lestow. You grant us a limited license to host, process, and display that content so we can operate the product and publish your site.",
  },
  {
    title: "Acceptable use",
    body: "Do not use Lestow to break the law, infringe other people’s rights, distribute malware, or attempt to disrupt the service. We may suspend or remove sites or accounts that violate this rule.",
  },
  {
    title: "Plans and payments",
    body: "Paid features are described on the Pricing page. Fees, usage limits, and billing periods depend on the plan you choose. Taxes and third-party payment processing may apply.",
  },
  {
    title: "Availability",
    body: "We work to keep Lestow reliable, but we do not guarantee uninterrupted access. Features may change as we improve the product.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent through the Get Quote form on the site or from your account dashboard.",
  },
];

export default function TermsOfService() {
  return (
    <SitePageShell
      title={
        <>
          Terms of <span className="text-blue-600">Service</span>
        </>
      }
      subtitle="The rules for using Lestow to create, edit, and publish websites."
      cta={{ label: "Privacy Policy", href: "/privacy" }}
      bandTitle="Clear terms so you can build with confidence."
    >
      <LegalDocument updatedAt="September 19, 2026" sections={sections} />
    </SitePageShell>
  );
}
