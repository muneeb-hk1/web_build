import Link from "next/link";
import SitePageShell from "./SitePageShell";

const topics = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I create my first website?",
        a: "From the homepage, start building and share a few details about your business. Lestow generates a complete site you can preview, edit, and publish.",
      },
      {
        q: "Do I need design or coding experience?",
        a: "No. The builder is made for anyone who can describe their business. You can change text, images, colors, and sections without writing code.",
      },
    ],
  },
  {
    title: "Editing and publishing",
    items: [
      {
        q: "Can I change the site after it is generated?",
        a: "Yes. You can edit copy, images, colors, fonts, navigation, and sections, then preview the result before you publish.",
      },
      {
        q: "Can I use my own domain?",
        a: "Yes. After your site is ready, you can connect your own domain from your account and take the site live.",
      },
    ],
  },
  {
    title: "Plans and account",
    items: [
      {
        q: "Where can I compare plans?",
        a: "Open the Pricing page to see individual and enterprise options. You can also manage billing from your account after you sign in.",
      },
      {
        q: "How do I get help with a quote or a custom need?",
        a: "Use Get Quote in the header. Tell us about the project and a teammate will follow up.",
      },
    ],
  },
];

export default function HelpCenter() {
  return (
    <SitePageShell
      title={
        <>
          Help <span className="text-blue-600">center</span>
        </>
      }
      subtitle="Find answers for building, editing, publishing, and managing your Lestow site."
      cta={{ label: "View pricing", href: "/pricing" }}
      bandTitle="Quick answers for the moments you need to keep building."
    >
      <section className="mx-auto max-w-[800px] px-5 pb-20 pt-6 sm:px-8 sm:pb-28">
        {topics.map((topic) => (
          <div key={topic.title} className="mb-12 last:mb-0">
            <h2 className="text-xl font-medium tracking-[-0.03em]">
              {topic.title}
            </h2>
            <div className="mt-4 divide-y divide-neutral-200">
              {topic.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span aria-hidden className="text-neutral-400 group-open:hidden">
                      +
                    </span>
                    <span aria-hidden className="hidden text-neutral-400 group-open:inline">
                      −
                    </span>
                  </summary>
                  <p className="pb-5 text-sm leading-7 text-neutral-600">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <p className="rounded-2xl border border-black/[0.06] bg-[#f8f8f8] px-6 py-5 text-sm leading-6 text-neutral-600">
          Still stuck? Read our{" "}
          <Link href="/privacy" className="font-medium text-blue-600 hover:underline">
            Privacy Policy
          </Link>{" "}
          or{" "}
          <Link href="/terms" className="font-medium text-blue-600 hover:underline">
            Terms of Service
          </Link>
          , or start from the homepage and send a quote request.
        </p>
      </section>
    </SitePageShell>
  );
}
