"use client";

import Link from "next/link";
import {
  FaFacebookF as Facebook,
  FaLinkedinIn as Linkedin,
  FaTwitter as Twitter,
  FaInstagram as Instagram,
} from "react-icons/fa";
import { MapPin, Mail, Smartphone, ChevronRight } from "lucide-react";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getAccentStyle } from "../../../lib/accentStyle";
import { getPageLabelFromHref, scrollTemplateToTop } from "../../../lib/previewNav";

const ACCENT = "#1FA463";
const ASSET = "/categories/cleaning/template1";

const defaultColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Services", href: "/services" },
      { label: "Our Team", href: "/team" },
      { label: "Our Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const defaultLegal = [
  { label: "Sitemap", href: "/sitemap" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookies Policy", href: "/cookies-policy" },
];

const defaultSocial = [
  { label: "facebook", href: "https://www.facebook.com/" },
  { label: "linkedin", href: "https://www.linkedin.com/" },
  { label: "twitter", href: "https://twitter.com/" },
  { label: "instagram", href: "https://www.instagram.com/" },
];

const socialIconMap: Record<string, React.ElementType> = {
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

export default function CleaningFooter1({ data = {} }: SectionProps) {
  const preview = useOptionalPreview();
  const accent = String(data.accentColor || ACCENT);
  const logoImage = String(
    data.logoImage || data.logo || `${ASSET}/logo/whitelogo.png`,
  );
  const logoAlt = String(data.logoImageTitle || data.logoAlt || "CleanPro");
  const desc = String(
    data.desc ||
      data.description ||
      "Lorem ipsum dolor sit amet, consec tetur elit eiusmod tempor incididunt labore dolore magna aliqua consec tetur adipis cing elite sed do labor.",
  );

  const contact = (data.footerContact || {}) as Record<string, any>;
  const address = String(
    contact.address || contact.location || "2976 Sunrise Avenue, Las Vegas",
  );
  const email = String(contact.email || "hello@anwa.com");
  const phone = String(contact.phone || "+1-3454-5678-77");

  const columns = (
    Array.isArray(data.footerColumns) && data.footerColumns.length
      ? data.footerColumns
      : defaultColumns
  ) as Array<{ title?: string; links?: Array<{ label?: string; href?: string }> }>;

  const socialLinks = (
    Array.isArray(data.footerSocialLinks) && data.footerSocialLinks.length
      ? data.footerSocialLinks
      : Array.isArray(data.socialLinks) && data.socialLinks.length
        ? data.socialLinks
        : defaultSocial
  ) as Array<{ label?: string; href?: string }>;

  const legalLinks = (
    Array.isArray(data.footerLegalLinks) && data.footerLegalLinks.length
      ? data.footerLegalLinks
      : defaultLegal
  ) as Array<{ label?: string; href?: string }>;

  const copyrightText = String(
    data.copyrightText ||
      data.copyright ||
      "Copyright © 2026. All rights reserved. Powered by Lestow",
  );

  const handleNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (!preview) return;
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    event.preventDefault();
    preview.setCurrentPage(getPageLabelFromHref(href, label));
    scrollTemplateToTop();
  };

  const quickColumn = columns[0];
  const subscribeTitle = String(columns[1]?.title || "Subscribe");
  const subscribeDesc = String(
    data.newsletterTitle ||
      "Subscribe To Our Newsletter To Get Our Update News!",
  );

  return (
    <footer
      className="relative z-10 overflow-hidden bg-[#262626] pt-40 text-white md:pt-48"
      style={getAccentStyle(accent)}
      data-editor-fields="logoImage logoImageTitle desc footerContact footerColumns footerSocialLinks socialLinks copyrightText footerLegalLinks accentColor"
    >
      <div className="mx-auto max-w-[1320px] px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:pr-6">
            <Link
              href="/"
              onClick={(event) => handleNavigate(event, "/", "Home")}
              className="-mt-6 mb-1 inline-block"
            >
              <img
                src={logoImage}
                alt={logoAlt}
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-role="logo"
                data-editor-media-src={logoImage}
                data-editor-media-overlay="show"
                className="h-auto w-[170px] object-contain"
              />
            </Link>
            <p className="-mt-10 max-w-[280px] text-[15px] leading-[1.6] text-[#C8C8C8]">
              {desc}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="mr-2 text-[15px] font-bold text-white">
                Follow Us:
              </span>
              {socialLinks.map((item, index) => {
                const label = String(item.label || "facebook").toLowerCase();
                const href = String(item.href || "#");
                const Icon = socialIconMap[label] || Facebook;
                return (
                  <a
                    key={`${label}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#16A361] transition hover:bg-[#16A361] hover:text-white"
                    aria-label={label}
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-white">Get In Touch</h3>
            <div className="mt-3 mb-6 h-[2px] w-10 bg-[#16A361]" />

            <div className="mb-5 flex gap-3">
              <MapPin size={18} className="mt-[3px] shrink-0 text-[#16A361]" />
              <div>
                <h5 className="text-[15px] font-bold text-white">Location:</h5>
                <p className="mt-[2px] text-[14px] leading-snug text-[#C8C8C8]">
                  {address}
                </p>
              </div>
            </div>

            <div className="mb-5 flex gap-3">
              <Mail size={18} className="mt-[3px] shrink-0 text-[#16A361]" />
              <div>
                <h5 className="text-[15px] font-bold text-white">Email:</h5>
                <a
                  href={`mailto:${email}`}
                  className="mt-[2px] block text-[14px] text-[#C8C8C8] transition hover:text-[#16A361]"
                >
                  {email}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Smartphone
                size={18}
                className="mt-[3px] shrink-0 text-[#16A361]"
              />
              <div>
                <h5 className="text-[15px] font-bold text-white">Phone:</h5>
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                  className="mt-[2px] block text-[14px] text-[#C8C8C8] transition hover:text-[#16A361]"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:pl-4">
            <h3 className="text-[22px] font-bold text-white">
              {quickColumn?.title || "Quick Links"}
            </h3>
            <div className="mt-3 mb-6 h-[2px] w-10 bg-[#16A361]" />
            <ul className="space-y-4">
              {(quickColumn?.links || []).map((link, index) => {
                const label = String(link.label || "");
                const href = String(link.href || "#");
                return (
                  <li key={`${label}-${index}`}>
                    <Link
                      href={href}
                      onClick={(event) => handleNavigate(event, href, label)}
                      className="flex items-center gap-3 text-[15px] text-[#C8C8C8] transition hover:text-[#16A361]"
                    >
                      <ChevronRight size={16} className="text-[#16A361]" />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-[22px] font-bold text-white">{subscribeTitle}</h3>
            <div className="mt-3 mb-6 h-[2px] w-10 bg-[#16A361]" />
            <p className="mb-6 max-w-[280px] text-[15px] leading-relaxed text-[#E5E5E5]">
              {subscribeDesc}
            </p>
            <div className="max-w-[280px]">
              <input
                type="email"
                placeholder="Your email address"
                className="h-[48px] w-full rounded-full bg-white px-6 text-[15px] text-[#333] outline-none placeholder:text-[#999]"
              />
              <button
                type="button"
                className="mt-4 h-[48px] w-full rounded-full bg-[#16A361] text-[16px] font-bold text-white transition hover:bg-[#128a51]"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#3a3a3a]">
          <div className="flex flex-col-reverse items-center justify-between gap-4 py-6 md:flex-row">
            <p className="mt-4 text-center text-[15px] text-[#999] md:mt-0 md:text-left">
              {copyrightText}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {legalLinks.map((item, index) => {
                const label = String(item.label || "");
                const href = String(item.href || "#");
                return (
                  <Link
                    key={`${label}-${index}`}
                    href={href}
                    onClick={(event) => handleNavigate(event, href, label)}
                    className="whitespace-nowrap text-[15px] text-[#999] transition-colors hover:text-[#16A361]"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

(
  CleaningFooter1 as typeof CleaningFooter1 & {
    editorFields: readonly string[];
  }
).editorFields = [
  "accentColor",
  "logoImage",
  "logoImageTitle",
  "logo",
  "desc",
  "footerContact",
  "footerColumns",
  "footerSocialLinks",
  "socialLinks",
  "copyrightText",
  "footerLegalLinks",
];
