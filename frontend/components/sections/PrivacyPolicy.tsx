import LegalDocument from "./LegalDocument";
import SitePageShell from "./SitePageShell";

const sections = [
  {
    title: "What we collect",
    body: "We collect account details such as your name and email, information you enter while building a site, and technical data needed to keep you signed in and the product working.",
  },
  {
    title: "How we use it",
    body: "We use this information to generate and save your website, operate your account, process quotes or payments, improve Lestow, and respond when you ask for help.",
  },
  {
    title: "Sharing",
    body: "We do not sell your personal information. We may share data with service providers who help us host, process payments, or send email — only as needed to run Lestow — or when the law requires it.",
  },
  {
    title: "Cookies",
    body: "Lestow uses necessary cookies to keep the product working. You can review optional cookies on the Cookie preferences page and read more on the Cookie Policy page.",
  },
  {
    title: "Retention",
    body: "We keep account and site data while your account is active and for a limited time afterward if we need it for security, billing, or legal reasons.",
  },
  {
    title: "Your choices",
    body: "You can update profile details from your account, manage cookie preferences in this browser, and ask us to correct or delete personal information where the law allows.",
  },
  {
    title: "Contact",
    body: "Privacy questions can be sent through the Get Quote form or from your account dashboard.",
  },
];

export default function PrivacyPolicy() {
  return (
    <SitePageShell
      title={
        <>
          Privacy <span className="text-blue-600">Policy</span>
        </>
      }
      subtitle="How Lestow collects, uses, and protects information when you build and publish a site."
      cta={{ label: "Cookie Policy", href: "/cookie-policy" }}
      bandTitle="Your data is used to run the product — not sold as a product."
    >
      <LegalDocument updatedAt="September 19, 2026" sections={sections} />
    </SitePageShell>
  );
}
