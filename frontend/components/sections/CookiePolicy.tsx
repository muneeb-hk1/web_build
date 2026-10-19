import Link from "next/link";
import LegalDocument from "./LegalDocument";
import SitePageShell from "./SitePageShell";

const sections = [
  {
    title: "What cookies are",
    body: "Cookies are small files stored on your device. Lestow uses them to keep you signed in, remember drafts and preferences, and — if you allow it — understand how the site is used.",
  },
  {
    title: "Necessary cookies",
    body: "These are required for security, authentication, and core features. The site cannot work properly without them, so they stay on.",
  },
  {
    title: "Optional cookies",
    body: "Functional cookies remember choices in the builder. Analytics cookies help us improve the product. Marketing cookies help us measure campaigns. You can turn these on or off at any time.",
  },
  {
    title: "Managing cookies",
    body: "Use the Cookie preferences page to save your choices for this browser. You can also block cookies in your browser settings, which may limit some features.",
  },
  {
    title: "Updates",
    body: "We may update this policy when we add features or change how cookies are used. The date at the top of this page shows the latest version.",
  },
];

export default function CookiePolicy() {
  return (
    <SitePageShell
      title={
        <>
          Cookie <span className="text-blue-600">Policy</span>
        </>
      }
      subtitle="How Lestow uses cookies and similar technologies, and how you can control them."
      cta={{ label: "Manage preferences", href: "/cookie-preferences" }}
      bandTitle="A short guide to the cookies used on this site."
    >
      <LegalDocument updatedAt="September 19, 2026" sections={sections} />
      <p className="mx-auto max-w-[760px] px-5 pb-20 text-sm text-neutral-600 sm:px-8">
        Ready to choose? Open{" "}
        <Link href="/cookie-preferences" className="font-medium text-blue-600 hover:underline">
          Cookie preferences
        </Link>
        .
      </p>
    </SitePageShell>
  );
}
