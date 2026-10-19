"use client";

import Link from "next/link";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";
import { WebsiteIcon } from "../../../lib/websiteIcons";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

export default function CleaningBanner1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const bgImage = String(
    data.backgroundImage || data.bgImage || `${ASSET}/banner/herobanner.png`,
  );
  const pretitle = String(
    data.pretitle || data.subtitle || "Reliable house cleaning professionals",
  );
  const title = String(data.title || "Consider it");
  const titleHighlight = String(data.titleHighlight || "Done");
  const desc = String(
    data.desc ||
      data.description ||
      "We understand that maintaining a spotless home can be a challenge in the hustle and bustle of daily life. That's why we've made it our specialty to know the ins and outs of house cleaning, so you don't have to.",
  );
  const bannerHeight = Math.max(
    40,
    Math.min(
      100,
      typeof data.bannerHeight === "number" && Number.isFinite(data.bannerHeight)
        ? data.bannerHeight
        : Number(data.bannerHeight) || 75,
    ),
  );
  const buttons = (
    Array.isArray(data.buttons) && data.buttons.length
      ? data.buttons
      : [
          {
            label: String(data.buttonText || "Book Now"),
            href: String(data.buttonHref || "/contact"),
            variant: "primary" as const,
          },
        ]
  ).slice(0, 2);
  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  return (
    <section
      className="relative flex min-h-[420px] items-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        ...getAccentStyle(accent),
        backgroundImage: `url('${bgImage}')`,
        height: `${bannerHeight}vh`,
      }}
      data-editor-fields="accentColor pretitle title titleHighlight desc backgroundImage bannerHeight buttons"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[600px]">
          <p className="mb-4 text-[18px] font-medium text-[var(--accent)]">
            {pretitle}
          </p>

          <h1 className="text-[50px] leading-[1.05] font-extrabold tracking-tight text-[#0D2235] lg:text-[80px]">
            {title}
            <br />
            <span className="text-[var(--accent)]">{titleHighlight}</span>
          </h1>

          <p className="mt-6 max-w-[500px] text-[16px] leading-[1.7] text-[#4A5568]">
            {desc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {buttons.map((button, index) => {
              const label = String(button.label || "Book Now");
              const href = String(button.href || "/contact");
              const isSecondary =
                button.variant === "secondary" || index > 0;
              const iconName = String(button.icon || "arrow-right");
              const iconBefore = button.iconPosition === "before";
              const iconClass = `h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${
                isSecondary ? "text-white" : "text-[var(--accent)]"
              }`;
              const iconBubble = (
                <span
                  className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full shadow-sm ${
                    isSecondary ? "bg-[var(--accent)]" : "bg-white"
                  }`}
                >
                  <WebsiteIcon
                    name={iconName === "none" ? "arrow-right" : iconName}
                    size={20}
                    className={iconClass}
                  />
                </span>
              );

              return (
                <Link
                  key={`${label}-${index}`}
                  href={href}
                  onClick={(event) => handleNavigate(event, href, label)}
                  target={button.openInNewTab ? "_blank" : undefined}
                  rel={button.openInNewTab ? "noopener noreferrer" : undefined}
                  className={
                    isSecondary
                      ? `group inline-flex items-center rounded-full border-2 border-[var(--accent)] bg-white py-2 transition-colors hover:bg-[#f0fdf4] ${
                          iconBefore ? "pr-10 pl-2" : "pr-2 pl-10"
                        }`
                      : `group inline-flex items-center rounded-full bg-[var(--accent)] py-2 transition-colors hover:bg-[#188c52] ${
                          iconBefore ? "pr-10 pl-2" : "pr-2 pl-10"
                        }`
                  }
                >
                  {iconBefore ? iconBubble : null}
                  <span
                    className={`text-[16px] font-bold ${
                      iconBefore ? "ml-6" : "mr-6"
                    } ${isSecondary ? "text-[var(--accent)]" : "text-white"}`}
                  >
                    {label}
                  </span>
                  {!iconBefore ? iconBubble : null}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

(
  CleaningBanner1 as typeof CleaningBanner1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "accentColor",
  "pretitle",
  "title",
  "titleHighlight",
  "desc",
  "backgroundImage",
  "bannerHeight",
  "buttons",
];
