import Image from "next/image";
import { Source_Serif_4 } from "next/font/google";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Folder,
  Globe,
  Globe2,
  Home,
  LayoutDashboard,
  LayoutTemplate,
  Plus,
  Settings,
  Sparkle,
  Sparkles,
  Users,
} from "lucide-react";
import Button from "../ui/Button";
import type { getOnboardingDraftSummary } from "@/lib/onboardingDraft";
import { getHeroStartLabel } from "./DraftResumeModal";

const minutesSerif = Source_Serif_4({
  subsets: ["latin"],
  style: "italic",
  weight: "700",
  display: "swap",
});

const minutesHighlight = `${minutesSerif.className} relative inline-block bg-lime-300 px-[0.22em] py-[0.04em] align-baseline text-[1.02em] font-bold italic leading-[0.95] tracking-[-0.03em] text-black`;

type HeroSectionProps = {
  onStart: () => void;
  draftSummary?: ReturnType<typeof getOnboardingDraftSummary>;
};

const gridSize = "clamp(74px, 10.6vw, 152px)";
const backgroundStyle: CSSProperties = {
  backgroundColor: "#2d5bf1",
  backgroundImage: [
    "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
    "radial-gradient(ellipse at 60% 110%, rgba(105, 208, 218, 0.65), transparent 75%)",
    "linear-gradient(120deg, #2855ed, #497cf4)",
  ].join(", "),
  backgroundSize: `${gridSize} ${gridSize}, ${gridSize} ${gridSize}, 100% 100%, 100% 100%`,
  backgroundRepeat: "repeat, repeat, no-repeat, no-repeat",
  backgroundPosition: "center, center, center, center",
};

function MinutesSparkle({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
    >
      <Image
        src="/minutes-sparkle.png"
        alt=""
        width={68}
        height={102}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

const desktopPills = [
  { icon: Sparkle, label: "AI Powered", iconClassName: "fill-[#ffe14a] text-[#ffe14a]" },
  { icon: Users, label: "Human Support", iconClassName: "text-white" },
] as const;

const previewNav = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Folder, label: "My Websites", active: false },
  { icon: LayoutTemplate, label: "Templates", active: false },
  { icon: Globe, label: "Domain", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
] as const;

function MobileHeroPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="flex h-[118%] min-h-full w-full flex-col rounded-t-[22px] bg-[#1a1d27] p-1.5 shadow-[0_24px_50px_rgba(8,28,110,.28)] sm:rounded-t-[26px] sm:p-2 md:rounded-t-[28px] md:p-2.5">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-2 py-1.5 text-white/80 sm:px-3 sm:py-2">
          <div className="flex gap-1 sm:gap-1.5">
            <span className="size-2 rounded-full bg-[#ff5f57] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#febc2e] sm:size-2.5" />
            <span className="size-2 rounded-full bg-[#28c840] sm:size-2.5" />
          </div>
          <div className="flex h-6 w-[min(42vw,220px)] items-center justify-center rounded-full bg-[#2c303b] text-[9px] text-white/80 sm:h-7 sm:text-[11px]">
            app.lestow.com
          </div>
          <div className="flex items-center justify-end gap-2 text-white/70 sm:gap-2.5">
            <ExternalLink size={13} aria-hidden />
            <Plus size={14} aria-hidden />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[14px] bg-[#f4f6fb] text-[#172033] sm:rounded-t-[18px]">
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(104px,30%)_minmax(0,1fr)] sm:grid-cols-[minmax(128px,158px)_minmax(0,1fr)]">
            <aside className="border-r border-black/5 bg-white px-2 py-2.5 sm:px-3 sm:py-3.5">
              <div className="mb-2 flex items-center gap-1.5 px-1 sm:mb-3">
                <Image src="/lestow-mark.svg" alt="" width={16} height={16} className="size-3.5 sm:size-4" />
                <span className="text-[11px] font-semibold sm:text-[13px]">Lestow</span>
              </div>
              <nav className="space-y-0.5">
                {previewNav.map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px] sm:gap-2 sm:px-2 sm:py-1.5 sm:text-[11px] ${active ? "bg-[#eef3ff] font-medium text-[#2f5cf6]" : "text-[#667085]"
                      }`}
                  >
                    <Icon size={12} aria-hidden />
                    <span>{label}</span>
                  </div>
                ))}
              </nav>
            </aside>

            <div className="min-w-0 px-2 py-2 sm:px-3.5 sm:py-3">
              <div className="mb-1.5 flex items-center justify-end gap-2 sm:mb-2">
                <Bell size={13} className="text-[#98a2b3]" aria-hidden />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-2 text-[9px] text-[#344054] shadow-sm sm:py-1 sm:pr-2.5 sm:text-[11px]">
                  <span className="relative size-4 overflow-hidden rounded-full bg-[#dbe4ff] sm:size-5">
                    <Image src="/blackbay.png" alt="" fill className="object-cover" sizes="20px" />
                  </span>
                  Alex Carter
                </span>
              </div>

              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(72px,34%)] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(120px,158px)] sm:gap-3">
                <div>
                  <p className="text-[9px] text-[#667085] sm:text-[11px]">
                    Welcome back, Alex <span aria-hidden>👋</span>
                  </p>
                  <p className="mt-0.5 text-[clamp(14px,3.4vw,22px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[#101828]">
                    Your website
                    <br />
                    is almost ready.
                  </p>
                  <p className="mt-1 max-w-[28ch] text-[9px] leading-snug text-[#667085] sm:text-[11px]">
                    Create, customize, and publish with AI — in minutes.
                  </p>
                  <div className="mt-2 flex flex-nowrap items-center gap-1.5 sm:mt-2.5 sm:gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#2f5cf6] px-2.5 py-1 text-[9px] font-medium text-white sm:px-3 sm:py-1.5 sm:text-[11px]">
                      <Plus size={11} aria-hidden />
                      Create Website
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[9px] text-[#344054] shadow-sm sm:px-3 sm:py-1.5 sm:text-[11px]">
                      View Templates
                    </span>
                  </div>
                </div>
                <div className="min-w-0 rounded-2xl bg-[#e8eeff] p-2 text-[8px] leading-snug text-[#31508f] sm:p-3 sm:text-[11px]">
                  <Sparkles size={12} className="mb-1 text-[#2f5cf6] sm:mb-1.5 sm:size-[14px]" aria-hidden />
                  Turn your ideas into a professional website with AI.
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
                <div className="rounded-xl bg-[#eef2ff] p-1.5 sm:p-2.5">
                  <div className="flex items-start justify-between">
                    <p className="text-[14px] font-semibold leading-none text-[#101828] sm:text-[18px]">3</p>
                    <Calendar size={13} className="text-[#7a8cff]" aria-hidden />
                  </div>
                  <p className="mt-1 text-[8px] text-[#667085] sm:text-[10px]">Websites</p>
                  <p className="mt-1.5 text-[8px] font-medium text-[#2f5cf6] sm:mt-2 sm:text-[10px]">View all →</p>
                </div>
                <div className="rounded-xl bg-[#e7f8ee] p-1.5 sm:p-2.5">
                  <p className="text-[14px] font-semibold leading-none text-[#101828] sm:text-[18px]">12.4K</p>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <p className="text-[8px] text-[#667085] sm:text-[10px]">Total Visitors</p>
                    <p className="text-[8px] font-semibold text-[#12b76a] sm:text-[10px]">↑ 24%</p>
                  </div>
                  <p className="mt-1.5 text-[8px] text-[#98a2b3] sm:mt-2 sm:text-[9px]">Last 30 days</p>
                </div>
                <div className="rounded-xl bg-[#e7f8ee] p-1.5 sm:p-2.5">
                  <div className="flex items-start justify-between">
                    <p className="text-[14px] font-semibold leading-none text-[#101828] sm:text-[18px]">89%</p>
                    <BarChart3 size={13} className="text-[#12b76a]" aria-hidden />
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-1">
                    <p className="text-[8px] text-[#667085] sm:text-[10px]">Uptime</p>
                    <p className="text-[8px] font-semibold text-[#12b76a] sm:text-[10px]">↑ 2%</p>
                  </div>
                  <p className="mt-1.5 text-[8px] text-[#98a2b3] sm:mt-2 sm:text-[9px]">Last 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const statuses = [
  {
    icon: LayoutDashboard,
    text: "Pages structured",
    className: "-left-4 top-[34%] lg:-left-28",
  },
  {
    icon: Sparkles,
    text: "Brand system applied",
    className: "-right-4 top-[24%] lg:-right-32",
  },
  {
    icon: Globe2,
    text: "Ready to publish",
    className: "right-[4%] bottom-[12%] lg:-right-24",
  },
];

export default function HeroSection({
  onStart,
  draftSummary = null,
}: HeroSectionProps) {
  return (
    <section
      data-hero-scroll
      className="relative h-[100dvh] overflow-hidden text-white xl:h-[190vh] xl:min-h-[1250px] xl:overflow-visible"
      style={backgroundStyle}
    >
      <div className="relative flex h-full min-h-0 flex-col overflow-hidden px-4 pt-[clamp(108px,28vw,124px)] sm:px-6 md:px-8 xl:sticky xl:top-0 xl:block xl:h-screen xl:min-h-[740px] xl:overflow-hidden xl:px-8 xl:pb-0 xl:pt-[116px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={backgroundStyle}
        />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center overflow-visible pb-0 xl:contents xl:h-full xl:flex-none xl:justify-center xl:gap-9 xl:overflow-visible xl:pb-16 xl:pt-20">
          <div className="flex w-full shrink-0 flex-col items-center pt-[clamp(6px,2.4dvh,22px)] xl:contents">
            <div
              data-hero-copy
              className="relative z-20 mx-auto w-full max-w-[1500px] shrink-0 text-center"
            >
              <div data-hero-text>
                <h1 className="text-center mt-2 text-[clamp(2.45rem,calc(0.55rem+11vw),4rem)] font-extrabold not-italic leading-[0.94] tracking-[-.045em] text-white max-[768px]:text-[clamp(2.45rem,calc(0.55rem+11vw),4rem)] min-[350px]:max-[561px]:!text-[clamp(2.9rem,calc(0.15rem+14.5vw),4.85rem)] sm:text-[clamp(2.7rem,calc(0.65rem+8.4vw),4.15rem)] md:text-[clamp(3.1rem,calc(0.85rem+6.2vw),4.35rem)] lg:text-[clamp(3.35rem,5vw,4.5rem)] xl:hidden">
                  <span className="block overflow-hidden">
                    <span data-hero-line className="block">
                      Build Your
                    </span>
                  </span>
                  <span className="block overflow-hidden pt-0.5">
                    <span data-hero-line className="block">
                      Website in
                    </span>
                  </span>
                  <span className="block overflow-hidden pb-1 pt-2">
                    <span data-hero-line className="block">
                      <span className={`${minutesHighlight} whitespace-nowrap rounded-[0.14em] !px-[0.28em] !py-[0.06em]`}>
                        10 Minutes
                      </span>
                    </span>
                  </span>
                </h1>
                <h1 className="hidden text-[clamp(3rem,6.5vw,5.2rem)] font-semibold not-italic leading-[.92] tracking-[-.035em] text-white xl:block">
                  <span className="block overflow-hidden pb-2">
                    <span data-hero-line className="block">
                      Build Your
                    </span>
                  </span>
                  <span className="block overflow-hidden pb-3 pt-3">
                    <span data-hero-line className="block whitespace-nowrap">
                      Website in{" "}
                      <span className={`${minutesHighlight} rounded-md`}>
                        10 Minutes
                        <MinutesSparkle className="left-[calc(100%+6px)] top-1/2 h-16 w-11 -translate-y-1/2 lg:h-[4.5rem] lg:w-12" />
                      </span>
                    </span>
                  </span>
                </h1>
                <p
                  data-hero-fade
                  className="mx-auto mt-2 max-w-[34ch] !font-light text-[clamp(14px,calc(0.58rem+2.1vw),19px)] leading-[1.35] tracking-[-.02em] text-white/90 sm:mt-2 sm:max-w-[40ch] sm:text-[clamp(15px,calc(0.62rem+1.6vw),20px)] md:max-w-[42ch] xl:mt-0 xl:max-w-3xl xl:text-[22px] xl:leading-8"
                  style={{ fontWeight: 300 }}
                >
                  {/* Create a professional website in minutes with AI. Generate
                stunning layouts, engaging content, and customize every detail to
                match your brand. */}
                  Build a beautiful, professional website with AI in minutes.
                </p>
              </div>

              <Button
                type="button"
                onClick={onStart}
                variant="dark"
                className="group relative z-30 mx-auto mt-2 mb-0 flex h-[clamp(44px,calc(2.2rem+2.4vw),54px)] w-full max-w-[min(100%,360px)] items-center justify-center gap-3 bg-black px-3 text-[clamp(14px,calc(0.65rem+1.7vw),17px)] font-medium text-white opacity-100 shadow-[0_18px_40px_rgba(4,17,74,.28)] [clip-path:polygon(18px_0,100%_0,100%_100%,0_100%,0_18px)] transition duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-[0_24px_50px_rgba(4,17,74,.38)] sm:mt-3.5 sm:max-w-[400px] md:mt-3 md:h-[54px] md:max-w-[420px] md:px-4 md:text-lg xl:mt-2 xl:h-14 xl:max-w-[420px] xl:text-base"
              >
                {getHeroStartLabel(draftSummary)}{" "}
                <ArrowRight
                  size={19}
                  aria-hidden
                  className="transition group-hover:translate-x-1"
                />
              </Button>







              <div className="mt-4 flex items-center justify-center gap-2.5 xl:mt-5">
                {desktopPills.map(({ icon: Icon, label, iconClassName }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium leading-none text-white"
                  >
                    <Icon size={14} strokeWidth={2} className={iconClassName} aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none relative z-50 mx-auto mt-auto w-full max-w-[720px] shrink-0 max-xl:!static max-xl:!top-10 max-xl:!translate-x-0 sm:max-w-[820px] md:max-w-[920px] xl:absolute xl:left-1/2 xl:top-[404px] xl:mt-0 xl:h-auto xl:max-h-none xl:w-[min(74vw,1180px)] xl:max-w-none xl:flex-none xl:shrink xl:-translate-x-1/2 xl:overflow-visible">
            <div
              data-hero-device
              className="relative h-[clamp(240px,36dvh,360px)] origin-top overflow-hidden will-change-transform sm:h-[clamp(280px,46dvh,400px)] md:h-[clamp(300px,48dvh,420px)] xl:h-auto xl:overflow-visible xl:translate-y-[150px] xl:scale-[0.9]"
            >


              <div className="absolute -inset-3 hidden rounded-[42%] bg-cyan-100/20 blur-[22px] xl:-inset-16 xl:block xl:blur-[65px]" />

              <div className="relative h-full w-full overflow-hidden xl:hidden">
                <MobileHeroPreview />
              </div>

              <div
                data-hero-dashboard
                className="relative hidden xl:block"
              >
              <div className="absolute -inset-7 rounded-[2.6rem] border border-white/15" />
              <div className="absolute -inset-3 rounded-[2.25rem] border border-cyan-100/25" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[#07111e] p-4 shadow-[0_55px_120px_rgba(5,24,111,.6),0_0_0_1px_rgba(255,255,255,.12)]">
                <div
                  data-dashboard-shine
                  className="pointer-events-none absolute -left-1/2 top-0 z-20 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="flex h-10 items-center justify-between px-3 text-white/85"
                >
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-red-500" />
                    <span className="size-2 rounded-full bg-yellow-400" />
                    <span className="size-2 rounded-full bg-[#b9ff66]" />
                  </div>
                  <span className="text-[8px] font-semibold uppercase tracking-[.18em]">
                    app.lestow.com
                  </span>
                  <span className="rounded-md bg-[#b9ff66] px-2.5 py-1 text-[8px] font-semibold text-[#07111e]">
                    Live
                  </span>
                </div>
                <div className="relative aspect-[1698/926] overflow-hidden rounded-[1.25rem] bg-[#f4f7fb]">
                  <Image
                    src="/lestow-dashboard-v10.jpg"
                    alt="Lestow AI website builder dashboard"
                    fill
                    unoptimized
                    sizes="(min-width: 1280px) 1180px, 920px"
                    className="object-contain object-center"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                </div>
              </div>
              </div>

              <div
                data-dashboard-status
                className="absolute -top-[74px] left-1/2 hidden -translate-x-1/2 translate-y-10 scale-75 items-center gap-3 whitespace-nowrap rounded-full border border-white/20 bg-[#07111e]/85 px-5 py-3 text-xs font-medium text-white opacity-0 shadow-2xl backdrop-blur-xl xl:flex"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#b9ff66] opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#b9ff66]" />
                </span>
                Your AI command center is ready
              </div>

              {statuses.map(({ icon: Icon, text, className }) => (
                <div
                  data-dashboard-status
                  key={text}
                  className={`absolute ${className} hidden translate-y-10 scale-75 items-center gap-3 rounded-sm bg-black/75 px-5 py-3 text-sm font-medium text-white opacity-0 shadow-[0_20px_50px_rgba(4,18,77,.35)] backdrop-blur-md xl:flex`}
                >
                  <Icon size={18} className="text-[#b9ff66]" aria-hidden />
                  {text}
                </div>
              ))}
              <div
                data-dashboard-status
                className="absolute -bottom-6 left-[9%] hidden translate-y-10 scale-75 items-center gap-2 rounded-sm bg-black/70 px-4 py-3 text-xs text-white/85 opacity-0 backdrop-blur-md xl:flex"
              >
                <CheckCircle2 size={12} className="text-[#b9ff66]" aria-hidden />{" "}
                Website health: excellent
              </div>
            </div>
          </div>
        </div>

        <div
          data-scroll-hint
          className="absolute inset-x-0 bottom-5 z-20 hidden justify-center xl:flex"
        >
          <span className="rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.18em] text-white/90 backdrop-blur-md">
            Scroll to open the dashboard
          </span>
        </div>
      </div>
    </section>
  );
}
