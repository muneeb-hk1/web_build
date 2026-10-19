import { CheckCircle2, Globe2, Sparkles, Zap } from "lucide-react";

const signals = [
  {
    icon: Zap,
    title: "AI-first build",
    detail: "Layout, copy, and structure from your business details",
  },
  {
    icon: Sparkles,
    title: "Edit without code",
    detail: "Change themes, sections, and content anytime",
  },
  {
    icon: Globe2,
    title: "Publish ready",
    detail: "Shared URL free · custom domain on Core",
  },
  {
    icon: CheckCircle2,
    title: "Mobile ready",
    detail: "Sites designed for phone, tablet, and desktop",
  },
] as const;

export default function SocialProof() {
  return (
    <section
      aria-label="Why builders choose Lestow"
      className="border-y border-black/[0.04] bg-[#fafafa] px-5 py-10 sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-[1100px]">
        <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-[#0a5ebd]">
          Built for real businesses
        </p>
        <h2 className="mx-auto mt-2 max-w-xl text-center text-[clamp(1.35rem,3vw,1.75rem)] font-normal leading-tight tracking-[-0.04em] text-[#080e42]">
          Everything you need to go from idea to live site
        </h2>
        <ul className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {signals.map(({ icon: Icon, title, detail }) => (
            <li
              key={title}
              className="rounded-2xl border border-black/[0.05] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]"
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#e7f1ff] text-[#1680ff]">
                <Icon aria-hidden size={17} strokeWidth={2} />
              </span>
              <h3 className="mt-3 text-[15px] font-normal tracking-[-0.03em] text-[#080e42]">
                {title}
              </h3>
              <p className="mt-1 text-sm font-light leading-5 tracking-[-0.01em] text-neutral-600">
                {detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
