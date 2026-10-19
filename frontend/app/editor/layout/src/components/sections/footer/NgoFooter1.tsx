"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { site, type NGOFooterData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";
import { useOptionalPreview } from "../../context/PreviewContext";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  LESTOW_COPYRIGHT_CREDIT,
  shouldShowLestowCopyright,
  stripLestowCopyrightCredit,
} from "@/lib/lestowBranding";

const flattenPreviewLinks = (
  links: Array<{ label?: string; href?: string; children?: unknown[] }> = [],
): Array<{ label?: string; href?: string }> =>
  links.flatMap((link) => [
    { label: link.label, href: link.href },
    ...flattenPreviewLinks(
      (link.children as Array<{
        label?: string;
        href?: string;
        children?: unknown[];
      }>) || [],
    ),
  ]);

const hrefSlug = (value?: string) => {
  const raw = (value || "").trim();
  const hash = raw.includes("#") ? raw.split("#")[1] || "" : "";
  const path = raw.split(/[?#]/)[0] || "";
  return (hash || path)
    .toLowerCase()
    .replace(/^page-/, "")
    .replace(/^\/+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const FOOTER_PAGE_FALLBACKS: Record<string, string> = {
  event: "Events",
  events: "Events",
  testimonial: "Testimonial",
  testimonials: "Testimonial",
  partner: "Partners",
  partners: "Partners",
  csr: "CSR",
  community: "CSR",
  "case-study": "Case Study",
  casestudy: "Case Study",
  service: "Services",
  services: "Services",
  activity: "Services",
  activities: "Services",
  career: "Careers",
  careers: "Careers",
  "service-details": "Service Details",
  "educational-support": "Educational Support",
  "education-support": "Educational Support",
  education: "Educational Support",
  "health-support": "Health Support",
  "healthcare-access": "Health Support",
  health: "Health Support",
  "food-support": "Food Support",
  "food-security-initiatives": "Food Support",
  sitemap: "Site Map",
  "site-map": "Site Map",
  "privacy-policy": "Privacy Policy",
  privacy: "Privacy Policy",
  "terms-conditions": "Terms & Conditions",
  terms: "Terms & Conditions",
  "refund-policy": "Refund Policy",
  refund: "Refund Policy",
  "cookie-policy": "Cookie Policy",
  cookie: "Cookie Policy",
  disclaimer: "Disclaimer",
  donate: "Donate",
  contact: "Contact",
  "contact-us": "Contact",
};
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import { IoLogoYoutube } from "react-icons/io5";
import { FaSquareInstagram } from "react-icons/fa6";

const asList = <T,>(value: unknown, fallback: T[] = []): T[] =>
  Array.isArray(value) && value.length ? (value as T[]) : fallback;

const asContactList = (value: unknown, fallback: unknown) => {
  if (Array.isArray(value) && value.length) return value;
  if (value && typeof value === "object") return [value];
  return Array.isArray(fallback) ? fallback : [];
};

export default function Footer({ data: customData }: SectionProps = {}) {
  const preview = useOptionalPreview();
  const fallback = site.footer ?? {};
  const custom = (customData ?? {}) as Partial<NGOFooterData> & {
    newsletterPlaceholder?: string;
    newsletterButton?: string;
    hotlineLabel?: string;
    hotlineIcon?: string;
    emailLabel?: string;
    emailIcon?: string;
  };
  const data = {
    ...fallback,
    ...custom,
    socialsLinks: asList(custom.socialsLinks, asList(fallback.socialsLinks)),
    links: asList(custom.links, asList(fallback.links)),
    link2: asList(custom.link2, asList(fallback.link2)),
    legalLinks: asList(custom.legalLinks, asList(fallback.legalLinks)),
    footerContact: asContactList(custom.footerContact, fallback.footerContact),
  };

  const getSocialIcon = (label: string) => {
    switch ((label || "").toLowerCase()) {
      case "facebook":
        return <FaFacebookF className="w-4 h-4" />;
      case "twitter":
        return <IoLogoTwitter className="w-4 h-4" />;
      case "youtube":
        return <IoLogoYoutube className="w-4 h-4" />;
      case "instagram":
        return <FaSquareInstagram className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const newsletterTitle =
    custom.newsletterTitle ||
    (data as { newsletterTitle?: string }).newsletterTitle ||
    (fallback as { newsletterTitle?: string }).newsletterTitle ||
    "Subscribe to our Newsletter";
  const newsletterPlaceholder =
    custom.newsletterPlaceholder ||
    (fallback as { newsletterPlaceholder?: string }).newsletterPlaceholder ||
    "Enter Your Email";
  const newsletterButton =
    custom.newsletterButton ||
    (fallback as { newsletterButton?: string }).newsletterButton ||
    "Subscribe";
  const hotlineLabel =
    custom.hotlineLabel ||
    (fallback as { hotlineLabel?: string }).hotlineLabel ||
    "Hotline Order";
  const emailUsLabel =
    custom.emailLabel ||
    (fallback as { emailLabel?: string }).emailLabel ||
    "Email Us";
  const hotlineIconName =
    custom.hotlineIcon ||
    (fallback as { hotlineIcon?: string }).hotlineIcon ||
    "phone";
  const emailIconName =
    custom.emailIcon ||
    (fallback as { emailIcon?: string }).emailIcon ||
    "mail";
  const primaryContact = data.footerContact?.[0];
  const showLestowCopyright = shouldShowLestowCopyright(
    (custom as { removeBranding?: boolean }).removeBranding,
  );
  const copyrightText =
    stripLestowCopyrightCredit(
      typeof data.copyright === "string" ? data.copyright : undefined,
    ) || "";

  const keepEditorOnCanvas = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!preview) return;
    event.preventDefault();
  };

  const openFooterPage = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
    fallbackLabel: string,
  ) => {
    keepEditorOnCanvas(event);
    if (!preview) return;
    const slug = hrefSlug(href);
    const match = flattenPreviewLinks(preview.pageLinks).find((link) => {
      const linkSlug = hrefSlug(link.href) || hrefSlug(link.label);
      return Boolean(slug) && (linkSlug === slug || hrefSlug(link.label) === slug);
    });
    preview.setCurrentPage(
      slug ||
        match?.label ||
        FOOTER_PAGE_FALLBACKS[slug] ||
        fallbackLabel,
    );
  };

  const scrollToTop = () => {
    const canvas = document.querySelector<HTMLElement>(
      "[data-editor-live-surface], [data-editor-canvas], main",
    );
    if (canvas) {
      canvas.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      data-editor-section-label="Footer"
      data-editor-fields="logoImage desc newsletterTitle newsletterPlaceholder newsletterButton hotlineLabel hotlineIcon emailLabel emailIcon socialsLinks links link2 footerContact copyright legalLinks bgImageUrl"
      className="relative bg-[#111111] text-white pt-8 pb-8 border-t border-whi
      te/10 overflow-hidden"
    >
      {data.bgImageUrl && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <Image
            src={data.bgImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-[#111111]/80" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-b-white/30 pb-8 sm:flex-row sm:justify-between">
          <div className="flex w-full flex-col gap-4 sm:gap-6 md:flex-row lg:w-1/2">
            <h3 className="text-xl font-bold text-white sm:text-2xl md:w-[190px]">
              {newsletterTitle}
            </h3>
            <form
              className="flex h-12 w-fit items-center overflow-hidden rounded-full border border-gray-700 bg-gray-200/30 transition focus-within:border-orange-500 md:h-[60px] md:w-[400px]"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                placeholder={newsletterPlaceholder}
                className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white md:text-base"
              />
              <button
                type="submit"
                className="flex h-full shrink-0 items-center justify-center rounded-full bg-[#f9570c] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#e04a05] md:px-8 md:text-lg"
              >
                {newsletterButton}
              </button>
            </form>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 lg:w-auto lg:flex-row lg:justify-end lg:gap-8">
            <div className="flex w-full items-center gap-3 lg:w-auto">
              <span className="shrink-0 rounded-full border border-gray-700 bg-[#2a2a2a] p-3 text-[#f9570c]">
                <EditableNgoIcon name={hotlineIconName} className="h-5 w-5" />
              </span>
              <div className="min-w-0 text-sm">
                <p className="text-gray-200">{hotlineLabel}</p>
                <a
                  href={primaryContact?.phoneHref || `tel:${primaryContact?.phone || ""}`}
                  className="block truncate font-bold text-white transition-colors hover:text-[#f9570c]"
                >
                  {primaryContact?.phone || "+91 1234-5678-90"}
                </a>
              </div>
            </div>
            <div className="flex w-full min-w-0 items-center gap-3 lg:w-auto">
              <span className="shrink-0 rounded-full border border-gray-700 bg-[#2a2a2a] p-3 text-[#f9570c]">
                <EditableNgoIcon name={emailIconName} className="h-5 w-5" />
              </span>
              <div className="min-w-0 text-sm lg:max-w-[240px]">
                <p className="text-gray-200">{emailUsLabel}</p>
                <a
                  href={`mailto:${primaryContact?.email || "abc@gmail.com"}`}
                  className="block truncate font-bold text-white transition-colors hover:text-[#f9570c]"
                >
                  {primaryContact?.email || "abc@gmail.com"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 my-10">
          <div className="space-y-5">
            <img
              src={data.logoImage || "/categories/ngo/template1/logo2.png"}
              alt="Logo"
              className="h-12 sm:h-14 w-auto object-contain"
            />
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              {data.desc}
            </p>
            <div className="flex gap-3 pt-1">
              {data.socialsLinks?.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 grid place-items-center rounded-full text-white/80 hover:text-white hover:bg-[#ff7a00] border border-white/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  {getSocialIcon(social.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <div className="flex items-center space-x-1">
              <span className="h-0.5 w-8 bg-[#ff7a00] rounded-full"></span>
              <span className="h-0.5 w-2 bg-[#ff7a00] rounded-full"></span>
            </div>
            <ul className="space-y-2.5 pt-1 text-sm font-normal text-white/80">
              {data.links?.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    data-editor-keep-click="true"
                    data-editor-nav="true"
                    onClick={(event) =>
                      openFooterPage(event, link.href, link.label)
                    }
                    className="hover:text-[#ff7a00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Our Services</h4>
            <div className="flex items-center space-x-1">
              <span className="h-0.5 w-8 bg-[#ff7a00] rounded-full"></span>
              <span className="h-0.5 w-2 bg-[#ff7a00] rounded-full"></span>
            </div>
            <ul className="space-y-2.5 pt-1 text-sm font-normal text-white/80">
              {data.link2?.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    data-editor-keep-click="true"
                    data-editor-nav="true"
                    onClick={(event) =>
                      openFooterPage(event, link.href, link.label)
                    }
                    className="hover:text-[#ff7a00] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">Get In Touch</h4>
            <div className="flex items-center space-x-1">
              <span className="h-0.5 w-8 bg-[#ff7a00] rounded-full"></span>
              <span className="h-0.5 w-2 bg-[#ff7a00] rounded-full"></span>
            </div>
            <div className="space-y-6 pt-1">
              {data.footerContact?.map((contact, idx) => (
                <div
                  key={idx}
                  className="space-y-2 text-sm text-white/80"
                >
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{contact.location}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-white shrink-0" />
                    <a
                      href={contact.phoneHref}
                      className="font-bold hover:text-[#ff7a00] transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-white shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-bold hover:text-[#ff7a00] transition-colors"
                    >
                      {contact.email}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          data-editor-fields="copyright legalLinks"
          className="relative pt-6 border-t border-white/15 text-sm text-white/70"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pr-0 md:pr-16">
            {(copyrightText || showLestowCopyright) ? (
              <p className="text-center md:text-left">
                {copyrightText ? <span>{copyrightText}</span> : null}
                {showLestowCopyright ? (
                  <span data-lestow-copyright data-editor-no-inline>
                    {copyrightText ? " " : ""}
                    {LESTOW_COPYRIGHT_CREDIT}
                  </span>
                ) : null}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {data.legalLinks?.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  data-editor-keep-click="true"
                  data-editor-nav="true"
                  onClick={(event) =>
                    openFooterPage(event, link.href, link.label)
                  }
                  className="hover:text-[#ff7a00] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="absolute right-0 -top-5 size-10 rounded-full bg-white text-[#111111] grid place-items-center shadow-md hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
