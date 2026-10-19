"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, PhoneCall } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";
import { WebsiteIcon } from "../../../lib/websiteIcons";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultMenu = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Pricing", href: "/pricing" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Faqs", href: "/faqs" },
      { label: "Awards", href: "/awards" },
      { label: "Our Team", href: "/team" },
      { label: "Career", href: "/career" },
      { label: "Enquiry", href: "/enquiry" },
      { label: "Industries We Serve", href: "/industries" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export default function CleaningHeader1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});

  const accent = String(data.accentColor || ACCENT);
  const menuItems = (
    Array.isArray(data.menu) && data.menu.length ? data.menu : defaultMenu
  ) as Array<Record<string, any>>;

  const logoText = String(data.logo || data.logoImageTitle || "CleanPro");
  const storedLogoImage = String(data.logoImage || "").trim();
  // Match layout-ivory: image logo by default (never fall back to text-only).
  const logoType =
    data.logoType === "text" ||
    data.logoType === "image-text" ||
    data.logoType === "image"
      ? data.logoType
      : "image";
  const logoImage = String(
    storedLogoImage || `${ASSET}/logo/newlogo1.png`,
  );
  const logoAlt = String(data.logoImageTitle || data.logoAlt || logoText);
  const hasLogoImage =
    logoImage.startsWith("/") ||
    logoImage.startsWith("http") ||
    logoImage.startsWith("data:");
  const showLogoImage =
    (logoType === "image" || logoType === "image-text") && hasLogoImage;
  const showLogoText = logoType === "text" || logoType === "image-text";
  const phoneLabel = String(data.phoneLabel || "Call Anytime");
  const phoneNumber = String(data.phoneNumber || data.phone || "+1 (254) 567-8900");
  const ctaButton =
    Array.isArray(data.buttons) && data.buttons[0]
      ? (data.buttons[0] as Record<string, unknown>)
      : null;
  const ctaText = String(ctaButton?.label || data.ctaText || "Get a Quote");
  const ctaUrl = String(ctaButton?.href || data.ctaUrl || "/quotes");
  const ctaIcon = String(ctaButton?.icon || "").trim();
  const ctaIconBefore = ctaButton?.iconPosition === "before";
  const showCtaIcon = Boolean(ctaIcon && ctaIcon !== "none");
  const headerSolidColor = String(data.headerBackgroundColor || "#ffffff");
  const headerGradientColor = String(data.headerGradientColor || accent);
  const headerBackground =
    data.headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${headerSolidColor}, ${headerGradientColor})`
      : headerSolidColor;
  const headerTextColor = String(data.headerTextColor || "#0D2235");
  const isSticky = (data.headerType ?? "sticky") === "sticky";

  const resolveHref = (candidate: any) =>
    String(candidate?.url || candidate?.href || "").trim();

  const isPlaceholderHref = (href: string) =>
    !href || href === "#" || href === "/#";

  const isActive = (item: any) => {
    if (!preview) return false;
    const currentPage = preview.currentPage.toLowerCase();
    const children = item.children || item.dropdownItems || item.subLinks || [];
    const candidates = [item, ...children].filter(
      (candidate) => !isPlaceholderHref(resolveHref(candidate)),
    );
    return candidates.some(
      (candidate) =>
        getPageLabelFromHref(
          resolveHref(candidate),
          candidate.label || candidate.title,
        ).toLowerCase() === currentPage,
    );
  };

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (isPlaceholderHref(href)) {
      event.preventDefault();
      return;
    }
    if (!preview) return;
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    setMenuOpen(false);
    scrollTemplateToTop();
  };

  return (
    <header
      className={`${isSticky ? "sticky top-0" : "relative"} z-50 overflow-visible shadow-sm`}
      style={{
        ...getAccentStyle(accent),
        background: headerBackground,
        color: headerTextColor,
        ["--header-text" as string]: headerTextColor,
      }}
      data-editor-fields="accentColor logoType logoImage logoImageTitle logo menu phoneLabel phoneNumber buttons ctaText ctaUrl headerType headerBackgroundType headerBackgroundColor headerGradientColor headerTextColor"
    >
      <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
        <div className="flex h-[90px] items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={(event) => handleNavigate(event, "/", "Home")}
          >
            {showLogoImage ? (
              <img
                src={logoImage}
                alt={logoAlt}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-role="logo"
                data-editor-media-src={logoImage}
                data-editor-media-overlay="show"
                className={`h-auto object-contain ${
                  showLogoText ? "w-[72px]" : "w-[210px]"
                }`}
              />
            ) : null}
            {showLogoText ? (
              <span className="text-xl font-extrabold text-[var(--header-text)]">
                {logoText}
              </span>
            ) : null}
          </Link>

          <nav className="hidden items-center gap-7 xl:gap-9 lg:flex">
            {menuItems.map((item, i) => {
              const label = String(item.label || item.title || "");
              const url = resolveHref(item) || "#";
              const children =
                item.children || item.dropdownItems || item.subLinks || [];
              const hasDropdown = children.length > 0;
              const active = isActive(item);

              return (
                <div
                  key={`${label}-${i}`}
                  className="group/navitem relative flex h-[90px] items-center"
                >
                  <Link
                    href={url}
                    onClick={(event) => handleNavigate(event, url, label)}
                    className={`relative flex items-center gap-1 text-[15px] font-bold transition-colors xl:text-base ${
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--header-text)] group-hover/navitem:text-[var(--accent)]"
                    }`}
                  >
                    {label}
                    {hasDropdown ? (
                      <ChevronDown
                        size={16}
                        className="mt-0.5 transition-transform duration-300 group-hover/navitem:rotate-180"
                      />
                    ) : null}
                  </Link>

                  {hasDropdown ? (
                    <div className="pointer-events-none invisible absolute top-[90px] left-0 z-[80] w-48 border-t-[3px] border-[var(--accent)] bg-white py-2 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group-hover/navitem:pointer-events-auto group-hover/navitem:visible group-hover/navitem:opacity-100">
                      {children.map((child: any, j: number) => {
                        const childLabel = String(child.label || child.title || "");
                        const childUrl = resolveHref(child) || "#";
                        return (
                          <Link
                            key={`${childLabel}-${j}`}
                            href={childUrl}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleNavigate(event, childUrl, childLabel);
                            }}
                            className="block px-5 py-2.5 text-[15px] font-semibold text-[#0D2235] transition-colors hover:bg-gray-50/50 hover:text-[var(--accent)]"
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF8EF]">
                <PhoneCall size={20} className="text-[var(--accent)]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-0.5 text-[13px] leading-tight font-semibold text-[var(--header-text)] opacity-70">
                  {phoneLabel}
                </p>
                <a
                  href={`tel:${phoneNumber.replace(/[^0-9+]/g, "")}`}
                  className="text-[15px] leading-tight font-extrabold text-[var(--header-text)]"
                >
                  {phoneNumber}
                </a>
              </div>
            </div>

            <Link
              href={ctaUrl}
              onClick={(event) => handleNavigate(event, ctaUrl, ctaText)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#18804d]"
            >
              {showCtaIcon && ctaIconBefore ? (
                <WebsiteIcon name={ctaIcon} size={16} className="text-white" />
              ) : null}
              {ctaText}
              {showCtaIcon && !ctaIconBefore ? (
                <WebsiteIcon name={ctaIcon} size={16} className="text-white" />
              ) : null}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[var(--header-text)] lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          menuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/10" style={{ background: headerBackground }}>
          <nav className="flex flex-col p-5">
            {menuItems.map((item, i) => {
              const label = String(item.label || item.title || "");
              const url = resolveHref(item) || "#";
              const children =
                item.children || item.dropdownItems || item.subLinks || [];
              const hasDropdown = children.length > 0;
              const open = Boolean(mobileDropdowns[label]);

              return (
                <div
                  key={`${label}-m-${i}`}
                  className="flex flex-col border-b border-gray-100"
                >
                  <Link
                    href={url}
                    className={`flex items-center justify-between py-3 text-[15px] font-bold ${
                      isActive(item) ? "text-[var(--accent)]" : "text-[var(--header-text)]"
                    }`}
                    onClick={(event) => {
                      if (hasDropdown) {
                        event.preventDefault();
                        setMobileDropdowns((prev) => ({
                          ...prev,
                          [label]: !prev[label],
                        }));
                        return;
                      }
                      handleNavigate(event, url, label);
                    }}
                  >
                    {label}
                    {hasDropdown ? (
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                      />
                    ) : null}
                  </Link>

                  {hasDropdown ? (
                    <div
                      className={`flex flex-col overflow-hidden pl-4 transition-all duration-300 ${
                        open ? "max-h-[240px] pb-3" : "max-h-0"
                      }`}
                    >
                      {children.map((child: any, j: number) => {
                        const childLabel = String(child.label || child.title || "");
                        const childUrl = resolveHref(child) || "#";
                        return (
                          <Link
                            key={`${childLabel}-m-${j}`}
                            href={childUrl}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleNavigate(event, childUrl, childLabel);
                            }}
                            className="py-2 text-[14px] font-semibold text-gray-600 hover:text-[var(--accent)]"
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="mt-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF8EF]">
                  <PhoneCall size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--header-text)] opacity-70">
                    {phoneLabel}
                  </p>
                  <p className="text-[15px] font-extrabold text-[var(--header-text)]">
                    {phoneNumber}
                  </p>
                </div>
              </div>
              <Link
                href={ctaUrl}
                onClick={(event) => handleNavigate(event, ctaUrl, ctaText)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-[15px] font-bold text-white transition-colors hover:bg-[#18804d]"
              >
                {showCtaIcon && ctaIconBefore ? (
                  <WebsiteIcon name={ctaIcon} size={16} className="text-white" />
                ) : null}
                {ctaText}
                {showCtaIcon && !ctaIconBefore ? (
                  <WebsiteIcon name={ctaIcon} size={16} className="text-white" />
                ) : null}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

(
  CleaningHeader1 as typeof CleaningHeader1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "accentColor",
  "logoType",
  "logoImage",
  "logoImageTitle",
  "logo",
  "menu",
  "phoneLabel",
  "phoneNumber",
  "buttons",
  "ctaText",
  "ctaUrl",
];
