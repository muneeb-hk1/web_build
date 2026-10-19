"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { InnerBannerAppearance } from "../../../types/innerBannerAppearance";

type NgoInnerBannerProps = {
  title?: string;
  breadcrumbHome?: string;
  breadcrumbCurrent?: string;
  image?: string;
  imageAlt?: string;
  appearance?: InnerBannerAppearance;
  editorFields?: string[];
};

const KNOWN_BANNER_TITLES: Record<string, string> = {
  about: "About Us",
  "about-us": "About Us",
  aboutus: "About Us",
  contact: "Contact Us",
  "contact-us": "Contact Us",
  contactus: "Contact Us",
  vision: "Our Vision",
  "our-vision": "Our Vision",
};

const formatBannerLabel = (value?: string, fallback = "Page") => {
  const raw = (value || "").trim();
  if (!raw) return fallback;
  const slug = raw.toLowerCase().replace(/[\s_]+/g, "-");
  const compact = raw.toLowerCase().replace(/[\s_-]+/g, "");
  return (
    KNOWN_BANNER_TITLES[slug] ||
    KNOWN_BANNER_TITLES[compact] ||
    raw.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  );
};

const renderSplitTitle = (heading: string, titleColor: string) => {
  const words = heading.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) {
    return <span style={{ color: titleColor }}>{heading}</span>;
  }
  const [first, ...rest] = words;
  return (
    <>
      <span className="text-[#f9570c]">{first}</span>
      {rest.length ? (
        <span style={{ color: titleColor }}>{` ${rest.join(" ")}`}</span>
      ) : null}
    </>
  );
};

export default function NgoInnerBanner1({
  title = "",
  breadcrumbHome = "Home",
  breadcrumbCurrent,
  image = "/categories/ngo/template1/group-friends-playing-together-wooden-tower-game.jpg",
  imageAlt = "",
  appearance,
}: NgoInnerBannerProps) {
  const overlayColor = appearance?.overlayColor || "rgba(0, 0, 0, 0.55)";
  const titleColor = appearance?.titleColor || "#ffffff";
  const heading = formatBannerLabel(title || breadcrumbCurrent, "Page");
  const current = formatBannerLabel(breadcrumbCurrent || title, heading);
  const homeLabel = formatBannerLabel(breadcrumbHome, "Home");
  const backgroundImage =
    (image || "").trim() ||
    "/categories/ngo/template1/group-friends-playing-together-wooden-tower-game.jpg";

  return (
    <section
      data-embedded-page-banner
      className="relative -mt-24 h-[75vh] min-h-[420px] w-full overflow-hidden bg-slate-900 md:-mt-32 md:h-[70vh] md:min-h-[380px]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor }}
        aria-hidden
      />
      <div className="relative z-10 flex h-full items-center justify-center md:items-end md:justify-start">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-5 pb-0 pt-24 text-center sm:px-8 md:items-start md:px-10 md:pb-14 md:text-left lg:px-16 lg:pb-16 xl:px-20 xl:pb-20">
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {renderSplitTitle(heading, titleColor)}
          </h1>
          <nav
            className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm font-bold sm:mt-5 sm:text-base md:justify-start"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-white/80 transition hover:text-[#f9570c]"
            >
              {homeLabel}
            </Link>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-[#f9570c]"
              aria-hidden
            />
            <span className="text-[#f9570c]">{current}</span>
          </nav>
        </div>
      </div>
      <span className="sr-only">{imageAlt || heading}</span>
    </section>
  );
}
